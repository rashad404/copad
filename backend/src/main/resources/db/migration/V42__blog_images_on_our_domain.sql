-- Serve the blog images from here, over https.
--
-- The three existing posts point their featured image at virtualhekim.az, and
-- two of them over plain http. On an https page a browser blocks the image and
-- marks the page as partly insecure, which is a poor thing for a health site
-- to look like, and the link would break the day that host stops answering.
--
-- The files are now in the repository as WebP, a tenth of the size, beside the
-- doctor photos and served by us. Matched on the file name, so a post whose
-- image was changed in the meantime is left alone.
--
-- Data only.

UPDATE blog_post
SET featured_image = '/blog-images/virtual-hekim-evinizden-cixmadan-tibbi-suallarinizi-cavablandirin.webp',
    updated_at = NOW()
WHERE slug = 'virtual-hekim-evinizden-cixmadan-tibbi-suallarinizi-cavablandirin'
  AND featured_image LIKE '%8fd6e07c-28da-4731-8d3c-aeeaf1936498%';

UPDATE blog_post
SET featured_image = '/blog-images/usaq-xestelikleri-virtual-hekimden-valideynler-ucun-faydali-meslehetler.webp',
    updated_at = NOW()
WHERE slug = 'usaq-xestelikleri-virtual-hekimden-valideynler-ucun-faydali-meslehetler'
  AND featured_image LIKE '%9b1dde4a-42db-4cab-a92d-7fee012c1ab0%';

UPDATE blog_post
SET featured_image = '/blog-images/usaqlarda-teztez-rast-gelinen-xestelikler-evde-ne-etmeli-1.webp',
    updated_at = NOW()
WHERE slug = 'usaqlarda-teztez-rast-gelinen-xestelikler-evde-ne-etmeli-1'
  AND featured_image LIKE '%8cef374f-f1b4-4a07-b6f8-9401f7ab195e%';
