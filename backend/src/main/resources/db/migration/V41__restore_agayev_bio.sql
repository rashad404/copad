-- Put back what the hospital publishes about Dr. Əsədulla Ağayev.
--
-- His public bio reads "dsfsadfasdf": text typed while testing the claim flow,
-- on a listing that patients can open. The original is restored from V22,
-- exactly as it was seeded. The claim itself is left in place for review.
--
-- Data only; V40 carries the schema.

UPDATE doctor
SET bio = 'İş təcrübəsi: Liv Bona Dea Beynəlxalq Xəstəxanası, Təcili Yardım Həkimi Iyun 2019 – …; International SOS (GIM) / BP AGT Xəzər Dənizi “Şah Dəniz Bravo” Layihəsi, Azərbaycan, Xəzər Dənizi, Platforma həkimi Fevral 2017-Noyabr 2019; Azərbaycan Milli Anti-Doping Agentliyi (AMADA), Azərbaycan, Bakı, Dopinq nəzarət İnspektoru İyun 2017; 4cü İslam Həmrəylik Oyunları, Azərbaycan, Bakı, “Heydər Əliyev” adına arenanın Tibbi məsləhətçisi May 2017; International SOS (GIM) / BP AGT Xəzər Dənizi“Dərin Sulu Günəşli” Layihəsi, Azərbaycan, Xəzər Dənizi, Platforma həkimi Yanvar  2015 – Yanvar 2017; International SOS (GIM), Azərbaycan, Bakı, Saytlar üzrə əlaqələndirici Aprel 2014-Dekabr 2014.',
    updated_at = NOW()
WHERE slug = 'dr-esedulla-agayev'
  AND bio = 'dsfsadfasdf';
