import os
from PIL import Image, ImageDraw, ImageFont

def create_placeholder(filename, text, size, color):
    img = Image.new('RGB', size, color=color)
    d = ImageDraw.Draw(img)
    
    # Try to load a default font, otherwise use whatever is available
    try:
        # For Windows, try to use Arial
        font = ImageFont.truetype("arial.ttf", size=int(size[0]*0.4))
    except:
        font = ImageFont.load_default()
        
    # Get text bounding box to center it
    try:
        bbox = d.textbbox((0, 0), text, font=font)
        text_width = bbox[2] - bbox[0]
        text_height = bbox[3] - bbox[1]
    except AttributeError:
        # Fallback for older PIL versions
        text_width, text_height = d.textsize(text, font=font)
        
    position = ((size[0] - text_width) / 2, (size[1] - text_height) / 2)
    
    d.text(position, text, fill=(255, 255, 255), font=font)
    img.save(filename)
    print(f"Generated {filename}")

if __name__ == "__main__":
    os.makedirs("public/images", exist_ok=True)
    
    bases = [
        ("ir_1350_50_bu", "1", (74, 144, 226)),    # Blue
        ("us_1921_1_ms63", "2", (216, 75, 107)),   # Red
        ("uk_1840_1d_vf", "3", (80, 227, 194))     # Teal
    ]
    
    for base, num, color in bases:
        # High Res (1200x1200)
        create_placeholder(f"public/images/{base}_hr.png", f"{num}-HR", (1200, 1200), color)
        # Low Res (600x600)
        create_placeholder(f"public/images/{base}_lr.png", f"{num}-LR", (600, 600), color)
        # Thumbnail (200x200)
        create_placeholder(f"public/images/{base}_thumb.png", num, (200, 200), color)
        
    print("Done generating 9 placeholder images!")
