DROP TABLE IF EXISTS items;
CREATE TABLE IF NOT EXISTS items (
  id TEXT PRIMARY KEY,
  type TEXT NOT NULL,
  country TEXT NOT NULL,
  value TEXT NOT NULL,
  year TEXT NOT NULL,
  quality TEXT NOT NULL,
  serialNumber TEXT,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  thumbnailUrl TEXT NOT NULL,
  lowResUrl TEXT NOT NULL,
  highResUrl TEXT NOT NULL
);

INSERT INTO items (id, type, country, value, year, quality, serialNumber, title, description, thumbnailUrl, lowResUrl, highResUrl) VALUES
('ir_1350_50_bu_1', 'paper_money', 'ایران', '۵۰ ریال', '۱۳۵۰', 'BU', '۱۲۳۴۵۶', '۵۰ ریال محمدرضا شاه پهلوی', 'اسکناس ۵۰ ریالی ایران با کیفیت بانکی و بدون گردش.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_hr.png'),
('us_1921_1_ms63_2', 'coin', 'آمریکا', '۱ دلار', '۱۹۲۱', 'MS63', NULL, 'یک دلار مورگان ۱۹۲۱', 'سکه یک دلاری نقره مورگان با کیفیت بسیار عالی MS63.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_hr.png'),
('uk_1840_1d_vf_3', 'stamp', 'انگلستان', '۱ پنی', '۱۸۴۰', 'VF', NULL, 'پنی بلک (Penny Black)', 'اولین تمبر پستی چسب‌دار جهان که در سال ۱۸۴۰ در بریتانیا منتشر شد.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_hr.png'),
('ir_1350_50_bu_4', 'paper_money', 'ایران', '۵۰ ریال', '۱۳۵۰', 'BU', '۱۲۳۴۵۷', '۵۰ ریال محمدرضا شاه پهلوی', 'اسکناس ۵۰ ریالی ایران با کیفیت بانکی و بدون گردش.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_hr.png'),
('us_1921_1_ms63_5', 'coin', 'آمریکا', '۱ دلار', '۱۹۲۱', 'MS63', NULL, 'یک دلار مورگان ۱۹۲۱', 'سکه یک دلاری نقره مورگان با کیفیت بسیار عالی MS63.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_hr.png'),
('uk_1840_1d_vf_6', 'stamp', 'انگلستان', '۱ پنی', '۱۸۴۰', 'VF', NULL, 'پنی بلک (Penny Black)', 'اولین تمبر پستی چسب‌دار جهان که در سال ۱۸۴۰ در بریتانیا منتشر شد.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_hr.png'),
('ir_1350_50_bu_7', 'paper_money', 'ایران', '۵۰ ریال', '۱۳۵۰', 'BU', '۱۲۳۴۵۸', '۵۰ ریال محمدرضا شاه پهلوی', 'اسکناس ۵۰ ریالی ایران با کیفیت بانکی و بدون گردش.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_hr.png'),
('us_1921_1_ms63_8', 'coin', 'آمریکا', '۱ دلار', '۱۹۲۱', 'MS63', NULL, 'یک دلار مورگان ۱۹۲۱', 'سکه یک دلاری نقره مورگان با کیفیت بسیار عالی MS63.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_hr.png'),
('uk_1840_1d_vf_9', 'stamp', 'انگلستان', '۱ پنی', '۱۸۴۰', 'VF', NULL, 'پنی بلک (Penny Black)', 'اولین تمبر پستی چسب‌دار جهان که در سال ۱۸۴۰ در بریتانیا منتشر شد.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_hr.png'),
('ir_1350_50_bu_10', 'paper_money', 'ایران', '۵۰ ریال', '۱۳۵۰', 'BU', '۱۲۳۴۵۹', '۵۰ ریال محمدرضا شاه پهلوی', 'اسکناس ۵۰ ریالی ایران با کیفیت بانکی و بدون گردش.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/ir_1350_50_bu_hr.png'),
('us_1921_1_ms63_11', 'coin', 'آمریکا', '۱ دلار', '۱۹۲۱', 'MS63', NULL, 'یک دلار مورگان ۱۹۲۱', 'سکه یک دلاری نقره مورگان با کیفیت بسیار عالی MS63.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/us_1921_1_ms63_hr.png'),
('uk_1840_1d_vf_12', 'stamp', 'انگلستان', '۱ پنی', '۱۸۴۰', 'VF', NULL, 'پنی بلک (Penny Black)', 'اولین تمبر پستی چسب‌دار جهان که در سال ۱۸۴۰ در بریتانیا منتشر شد.', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_thumb.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_lr.png', 'https://pub-4eebccbd3b5c49b4b656b13a58a22a3a.r2.dev/uk_1840_1d_vf_hr.png');
