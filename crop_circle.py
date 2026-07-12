import sys
from PIL import Image, ImageDraw

def crop_circle(input_path, output_path):
    try:
        # Open the image and convert to RGBA (for transparency)
        img = Image.open(input_path).convert("RGBA")
        
        # Make the image a perfect square based on the shortest side
        width, height = img.size
        size = min(width, height)
        
        left = (width - size) / 2
        top = (height - size) / 2
        right = (width + size) / 2
        bottom = (height + size) / 2
        
        img = img.crop((left, top, right, bottom))
        
        # Create a perfectly circular mask
        mask = Image.new("L", (size, size), 0)
        draw = ImageDraw.Draw(mask)
        draw.ellipse((0, 0, size, size), fill=255)
        
        # Apply the mask to the image
        result = Image.new("RGBA", (size, size))
        result.paste(img, (0, 0), mask=mask)
        
        # Save as a transparent PNG
        result.save(output_path, format="PNG")
        print(f"✅ Success! Cropped {input_path} into a transparent circle at {output_path}")
    except Exception as e:
        print(f"❌ Error processing {input_path}: {e}")

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python crop_circle.py <input_image> <output_image>")
        sys.exit(1)
        
    crop_circle(sys.argv[1], sys.argv[2])
