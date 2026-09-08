-- One listing in V22 took its name from the wrong element.
--
-- The card for this dietitian was laid out differently from the other 69, so
-- the scrape read the specialty label where the name should have been and the
-- directory published a doctor called "Dietologiya". Corrected here from the
-- profile page rather than by re-running the whole seed, because the other 69
-- rows are right and may already have been edited by hand.

UPDATE doctor SET
    full_name = 'Dyt. SEDA ERÇETIN',
    slug = 'dyt-seda-ercetin',
    specialty_code = 'dietetics',
    qualifications = 'Haliç Üniversitesi - Sağlık Bilimleri Fakültesi, Beslenme ve Diyetetik (2013-2017)',
    years_experience = 9,
    bio = 'Fəaliyyət sahələri: Çəki itkisi, çəki artımı və çəkiyə nəzarətin idarə edilməsi, İdman qidası, Bariatrik əməliyyatdan sonra qidalanma, Hamilə, ana, uşaq qidalanması, Klinik xəstəliklərdə qidalanma, Müasir qidalanma üsulları, Vegan qidalanma, Psixoloji qidalanma pozğunluqları, Enteral-parenteral qidalanma, Şəkərli diabetdə qidalanma terapiyası, Ketogenik pəhriz ekspertizası, Mətbəx və menyunun planlaşdırılması.',
    updated_at = NOW()
WHERE slug = 'dietologiya'
  AND source = 'livhospital.az';
