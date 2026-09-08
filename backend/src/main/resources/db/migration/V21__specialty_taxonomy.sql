-- The clinical specialties a directory needs.
--
-- Separate from medical_specialties, which drives the assistant's personas.
-- Those are different problems: the assistant needs a handful of areas it can
-- answer as, while a directory needs the whole taxonomy a hospital actually
-- employs - one Baku hospital alone spans 41. Adding "Pathology" as a chat
-- persona would mean writing a system prompt nobody will ever talk to.
--
-- patient_facing is the distinction that keeps the directory honest without
-- leaving anybody out. A pathologist and a microbiologist are doctors and
-- belong in a complete listing, but nobody books an appointment with them, so
-- they are never offered for booking and never suggested as somebody to go and
-- see.
--
-- ai_specialty_code maps a specialty onto the persona that should answer
-- questions about it, so a gastroenterology question still reaches a competent
-- prompt without inventing a gastroenterologist persona.

CREATE TABLE specialty (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    code              VARCHAR(64)  NOT NULL,
    name_az           VARCHAR(255) NOT NULL,
    name_en           VARCHAR(255) NOT NULL,
    name_ru           VARCHAR(255) NULL,
    patient_facing    TINYINT(1)   NOT NULL DEFAULT 1,
    ai_specialty_code VARCHAR(64)  NULL,
    active            TINYINT(1)   NOT NULL DEFAULT 1,
    sort_order        INT          NOT NULL DEFAULT 100,
    PRIMARY KEY (id),
    UNIQUE KEY uq_specialty_code (code),
    KEY idx_specialty_facing (patient_facing, active)
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

INSERT INTO specialty (code, name_az, name_en, name_ru, patient_facing, ai_specialty_code, sort_order) VALUES
-- The common ones a person looks for first.
('general-practice','Ümumi həkim','General Practitioner','Терапевт',1,'general',1),
('pediatrics','Uşaq həkimi','Paediatrician','Педиатр',1,'pediatric',2),
('obstetrics-gynecology','Mamalıq-ginekologiya','Obstetrics and Gynaecology','Акушерство и гинекология',1,'general',3),
('cardiology','Kardiologiya','Cardiology','Кардиология',1,'cardio',4),
('dermatology','Dermatologiya','Dermatology','Дерматология',1,'derma',5),
('ent','Qulaq-Burun-Boğaz','Ear, Nose and Throat','Оториноларингология',1,'ent',6),
('neurology','Nevrologiya','Neurology','Неврология',1,'general',7),
('psychiatry','Psixiatriya','Psychiatry','Психиатрия',1,'psych',8),
('ophthalmology','Göz Xəstəlikləri','Ophthalmology','Офтальмология',1,'general',9),
('internal-medicine','Daxili xəstəliklər','Internal Medicine','Терапия',1,'general',10),
('gastroenterology','Qastroenterologiya','Gastroenterology','Гастроэнтерология',1,'general',11),
('endocrinology','Endokrinologiya','Endocrinology','Эндокринология',1,'general',12),
('urology','Urologiya','Urology','Урология',1,'general',13),
('orthopedics','Ortopediya və Travmatologiya','Orthopaedics and Traumatology','Ортопедия и травматология',1,'general',14),
('general-surgery','Ümumi Cərrahiyyə','General Surgery','Общая хирургия',1,'general',15),
('oncology','Onkologiya','Oncology','Онкология',1,'general',16),
('hematology','Hematologiya','Haematology','Гематология',1,'general',17),
('nephrology','Nefrologiya','Nephrology','Нефрология',1,'general',18),
('pulmonology','Pulmonologiya','Pulmonology','Пульмонология',1,'general',19),
('rheumatology','Revmatologiya','Rheumatology','Ревматология',1,'general',20),
('infectious-diseases','İnfeksion Xəstəliklər','Infectious Diseases','Инфекционные болезни',1,'general',21),
('neurosurgery','Neyrocərrahiyyə','Neurosurgery','Нейрохирургия',1,'general',22),
('cardiovascular-surgery','Ürək-Damar Cərrahiyyəsi','Cardiovascular Surgery','Сердечно-сосудистая хирургия',1,'cardio',23),
('thoracic-surgery','Torakal cərrahiyyə','Thoracic Surgery','Торакальная хирургия',1,'general',24),
('plastic-surgery','Plastik, Estetik və Rekonstruktiv Cərrahiyyə','Plastic and Reconstructive Surgery','Пластическая хирургия',1,'general',25),
('physiotherapy','Fizioterapiya və Reabilitasiya','Physiotherapy and Rehabilitation','Физиотерапия и реабилитация',1,'general',26),
('emergency-medicine','Təcili tibbi yardım','Emergency Medicine','Неотложная помощь',1,'general',27),
('algology','Alqologiya','Pain Medicine','Алгология',1,'general',28),
('audiology','Audiologiya','Audiology','Аудиология',1,'ent',29),
('dietetics','Dietologiya','Dietetics','Диетология',1,'general',30),
('ivf','Süni mayalanma','IVF and Reproductive Medicine','ЭКО',1,'general',31),
('stem-cell','Kök hüceyrə','Stem Cell Therapy','Клеточная терапия',1,'general',32),
('check-up','Check Up','Health Check-up','Чек-ап',1,'general',33),
-- Paediatric sub-specialties.
('pediatric-surgery','Uşaq Cərrahiyyəsi','Paediatric Surgery','Детская хирургия',1,'pediatric',40),
('pediatric-neurology','Uşaq Nevrologiyası','Paediatric Neurology','Детская неврология',1,'pediatric',41),
('pediatric-hematology-oncology','Uşaq Hematologiyası və Onkologiyası','Paediatric Haematology and Oncology','Детская гематология и онкология',1,'pediatric',42),
('pediatric-allergy-immunology','Uşaq Allerqologiyası və İmmunologiyası','Paediatric Allergology and Immunology','Детская аллергология и иммунология',1,'pediatric',43),
('pediatric-cardiovascular-surgery','Uşaq Ürək-Damar Cərrahiyyəsi','Paediatric Cardiovascular Surgery','Детская сердечно-сосудистая хирургия',1,'pediatric',44),
-- Doctors, and part of a complete listing, but nobody books an appointment
-- with them. Never offered for booking, never suggested as somebody to see.
('anesthesiology','Anesteziologiya və İntensiv Terapiya','Anaesthesiology and Intensive Care','Анестезиология и реаниматология',0,NULL,80),
('radiology','Radiologiya','Radiology','Радиология',0,NULL,81),
('pathology','Patologiya','Pathology','Патология',0,NULL,82),
('microbiology','Mikrobiologiya','Microbiology','Микробиология',0,NULL,83),
('laboratory','Laboratoriya','Laboratory Medicine','Лабораторная диагностика',0,NULL,84);
