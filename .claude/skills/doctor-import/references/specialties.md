# Mapping a department to a specialty code

`doctor.specialty_code` is a plain string that has to match `specialty.code`.
Nothing enforces it - there is no foreign key - so a typo produces a listing
that is invisible to the specialty filter and shows an untranslated code to
whoever finds it.

## The 53 codes that exist

Read live before trusting this list; it was correct when written.

```bash
ssh -p 21098 root@203.161.35.63 "mysql --default-character-set=utf8mb4 -uroot copad_db -N -B -e \
  'SELECT code, name_az, patient_facing FROM specialty WHERE active = 1 ORDER BY sort_order'"
```

### Patient facing

| code | name_az |
|---|---|
| `general-practice` | Ümumi həkim |
| `pediatrics` | Uşaq həkimi |
| `obstetrics-gynecology` | Mamalıq-ginekologiya |
| `cardiology` | Kardiologiya |
| `dermatology` | Dermatologiya |
| `ent` | Qulaq-Burun-Boğaz |
| `neurology` | Nevrologiya |
| `psychiatry` | Psixiatriya |
| `ophthalmology` | Göz Xəstəlikləri |
| `internal-medicine` | Daxili xəstəliklər |
| `gastroenterology` | Qastroenterologiya |
| `endocrinology` | Endokrinologiya |
| `urology` | Urologiya |
| `orthopedics` | Ortopediya və Travmatologiya |
| `general-surgery` | Ümumi Cərrahiyyə |
| `oncology` | Onkologiya |
| `hematology` | Hematologiya |
| `nephrology` | Nefrologiya |
| `pulmonology` | Pulmonologiya |
| `rheumatology` | Revmatologiya |
| `infectious-diseases` | İnfeksion Xəstəliklər |
| `neurosurgery` | Neyrocərrahiyyə |
| `cardiovascular-surgery` | Ürək-Damar Cərrahiyyəsi |
| `thoracic-surgery` | Torakal cərrahiyyə |
| `plastic-surgery` | Plastik, Estetik və Rekonstruktiv Cərrahiyyə |
| `physiotherapy` | Fizioterapiya və Reabilitasiya |
| `emergency-medicine` | Təcili tibbi yardım |
| `algology` | Alqologiya |
| `audiology` | Audiologiya |
| `dietetics` | Dietologiya |
| `ivf` | Süni mayalanma |
| `stem-cell` | Kök hüceyrə |
| `check-up` | Check Up |
| `pediatric-surgery` | Uşaq Cərrahiyyəsi |
| `pediatric-neurology` | Uşaq Nevrologiyası |
| `pediatric-hematology-oncology` | Uşaq Hematologiyası və Onkologiyası |
| `pediatric-allergy-immunology` | Uşaq Allerqologiyası və İmmunologiyası |
| `pediatric-cardiovascular-surgery` | Uşaq Ürək-Damar Cərrahiyyəsi |
| `bariatric-surgery` | Bariatrik cərrahiyyə |
| `dentistry` | Stomatologiya |
| `home-care` | Evdə tibbi xidmət |
| `medical-aesthetics` | Medikal estetika |
| `pediatric-intensive-care` | Uşaq reanimasiyası |
| `breast-surgery` | Süd vəzi cərrahiyyəsi |
| `pediatric-endocrinology` | Uşaq endokrinologiyası |
| `pediatric-cardiology` | Uşaq kardiologiyası |
| `child-psychology` | Uşaq və yeniyetmə psixologiyası |
| `interventional-radiology` | İnvaziv radiologiya |

### Listed, but never offered for booking

`patient_facing = 0`. These doctors belong in a complete directory, and nobody
makes an appointment with them, so they are never suggested as somebody to go
and see.

| code | name_az |
|---|---|
| `anesthesiology` | Anesteziologiya və İntensiv Terapiya |
| `radiology` | Radiologiya |
| `pathology` | Patologiya |
| `microbiology` | Mikrobiologiya |
| `laboratory` | Laboratoriya |

## Common Azerbaijani department names

What hospital sites actually write, and where it goes.

| On the site | Code |
|---|---|
| Terapiya, Terapevt | `internal-medicine` |
| Ailə həkimi | `general-practice` |
| Uşaq həkimi, Pediatriya, Neonatologiya | `pediatrics` |
| Ginekologiya, Mama-ginekoloq, Doğuş | `obstetrics-gynecology` |
| Kardiologiya, Invaziv kardiologiya | `cardiology` |
| Dəri-zöhrəvi xəstəlikləri, Dermatovenerologiya | `dermatology` |
| LOR, Otorinolarinqologiya | `ent` |
| Nevropatologiya, Nevrologiya | `neurology` |
| Psixiatriya, Psixoterapiya | `psychiatry` |
| Oftalmologiya, Göz həkimi | `ophthalmology` |
| Qastroenterologiya, Hepatologiya, Endoskopiya | `gastroenterology` |
| Endokrinologiya, Diabetologiya | `endocrinology` |
| Uroloq, Androloq | `urology` |
| Travmatologiya, Ortopediya | `orthopedics` |
| Cərrahiyyə, Ümumi cərrahiyyə, Proktologiya | `general-surgery` |
| Onkologiya, Kimyaterapiya, Onkoloji cərrahiyyə | `oncology` |
| Şüa terapiyası, Radioterapiya | `oncology`, unless the source separates it |
| Hematologiya | `hematology` |
| Nefrologiya, Dializ | `nephrology` |
| Pulmonologiya, Ftiziatriya | `pulmonology` |
| Revmatologiya | `rheumatology` |
| İnfeksionist | `infectious-diseases` |
| Neyrocərrahiyyə | `neurosurgery` |
| Ürək-damar cərrahiyyəsi, Angiologiya | `cardiovascular-surgery` |
| Anestezioloq, Reanimatoloq, İntensiv terapiya | `anesthesiology` |
| Radiologiya, Rentgenologiya, USM, MRT, KT | `radiology` |
| Patomorfologiya, Sitologiya | `pathology` |
| Mikrobiologiya | `microbiology` |
| Laborator diaqnostika, Biokimya laboratoriyası | `laboratory` |
| Fizioterapiya, Reabilitasiya, Müalicəvi bədən tərbiyəsi | `physiotherapy` |
| Stomatologiya, Ortodontiya, İmplantologiya | `dentistry` |
| Estetik təbabət, Kosmetologiya | `medical-aesthetics` |
| Dietologiya, Qidalanma | `dietetics` |
| Təcili yardım, Reanimasiya (təcili) | `emergency-medicine` |
| Ağrı təbabəti | `algology` |
| Süni mayalanma, EKO, Reproduktologiya | `ivf` |

## The rules

**Map to the code a patient would search for, not the one the hospital's
organisation chart uses.** A hospital's "Kardiologiya-2 şöbəsi" is
`cardiology`. Somebody looking for a cardiologist does not know which of the
two departments they want.

**A sub-specialty gets its own code only when a patient chooses on it.** A
paediatric cardiologist and an adult cardiologist are not interchangeable for
somebody with a child, which is why `pediatric-cardiology` exists. A
"invaziv kardioloq" and a "kardioloq" are both `cardiology`.

**When two codes both fit, take the one the doctor practises**, not the one
they trained in. The listing describes what they do now.

**When nothing fits, add a code.** Do not force a doctor into an approximate
specialty, and do not leave the department out of the directory's vocabulary.
In the same migration, before the doctors:

```sql
INSERT IGNORE INTO specialty (code, name_az, name_en, name_ru, patient_facing, ai_specialty_code, sort_order) VALUES
('<code>','<Azərbaycanca>','<English>','<Русский>',1,'general',<next sort_order>);
```

- `code` is lowercase ASCII with hyphens, in English, matching the style of
  what is already there.
- All three names are filled. A NULL `name_ru` leaves the specialty
  untranslated for Russian readers, which is how the Russian filter ends up
  with a blank entry.
- `patient_facing` is 0 only when nobody makes an appointment with this kind of
  doctor - the diagnostic and laboratory disciplines above.
- `ai_specialty_code` points at an existing assistant persona, which is one of
  `general`, `pediatric`, `cardio`, `derma`, `ent`, `psych`. It is `general`
  unless the specialty is obviously one of the others. It is not a new persona:
  adding one means writing a system prompt nobody will talk to.
- `sort_order` continues from the highest in the table.

**Never invent a specialty for a doctor whose department the source does not
state.** NULL is a listing with no specialty shown. A wrong specialty is a
patient in the wrong waiting room.
