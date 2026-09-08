-- Serve the doctor portraits ourselves instead of hotlinking the hospital.
--
-- V22 pointed photo_url at livhospital.az and cdn.livhospital.com, which made
-- every card on our directory depend on somebody else's CDN staying arranged
-- the way it is today. The files now live in the frontend under
-- /doctor-photos, converted to webp and resized, so the directory keeps
-- working whatever they do next.
--
-- The path is derived from the slug because that is exactly how the files were
-- named, so this stays correct without listing seventy rows.

UPDATE doctor
SET photo_url = CONCAT('/doctor-photos/', slug, '.webp'),
    updated_at = NOW()
WHERE source = 'livhospital.az'
  AND photo_url IS NOT NULL;

-- Nobody at the hospital publishes which languages a doctor speaks, and the
-- listing left it null, which meant a language filter matched none of the
-- seventy. Azerbaijani is the working language of every clinic in this
-- directory, so it is the honest default rather than a guess.
UPDATE doctor
SET languages = 'az',
    updated_at = NOW()
WHERE source = 'livhospital.az'
  AND (languages IS NULL OR languages = '');
