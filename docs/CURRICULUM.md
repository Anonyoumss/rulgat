# Curriculum — Al-Moasser 11 (المعاصر ١١) Taxonomy

Stable chapter/topic IDs used across lessons, questions, garden scenes,
stories, deep links (`rulgat://lesson/{id}`), and QR codes.

## Chapter 0 — الباب زيرو (Foundation / تأسيس)
| topic_id | Topic (AR) | Topic (EN) |
|---|---|---|
| `ch0.intro` | مقدمة ومنهجية الحل السريع | Intro & quick-solve strategy |
| `ch0.bigint` | العمليات على الأعداد الكبيرة | Large-number arithmetic |
| `ch0.stats` | الإحصاء | Statistics |
| `ch0.prob` | الاحتمالات | Probability |
| `ch0.div` | قواعد القسمة والموافقات | Divisibility rules |

## Chapter 1 — الباب الأول (Basics / الأساسيات)
| topic_id | Topic (AR) | Topic (EN) |
|---|---|---|
| `ch1.dec` | الأعداد العشرية | Decimals |
| `ch1.frac` | الكسور | Fractions |
| `ch1.root` | الجذور | Roots |
| `ch1.exp` | الأسس | Exponents |
| `ch1.sdt` | السرعة والمسافة والزمن | Speed/distance/time |
| `ch1.rel` | الحركة النسبية | Relative motion |

## Chapter 2 — الباب الثاني (Ratios & Percent / النسب والنسبة)
| topic_id | Topic (AR) | Topic (EN) |
|---|---|---|
| `ch2.ratio` | النسب والتناسب | Ratios & proportions |
| `ch2.pct` | النسب المئوية | Percentages |
| `ch2.pfl` | الربح والخسارة | Profit & loss |
| `ch2.div` | القسمة التناسبية | Proportional division |
| `ch2.mean` | الوسط الحسابي | Arithmetic mean |

## Chapter 3 — الباب الثالث (Geometry / الهندسة)
| topic_id | Topic (AR) | Topic (EN) | Feeds garden game? |
|---|---|---|---|
| `ch3.ang` | الزوايا | Angles | |
| `ch3.poly` | multisided المضلعات | Polygons | ✓ |
| `ch3.pyth` | مثلثات فيثاغورس (3-4-5, 6-8-10, 30-60, 45-45) | Pythagorean triangles | ✓ |
| `ch3.rect` | المستطيلات والمربعات | Rectangles & squares | ✓ |
| `ch3.circ` | الدوائر والقطاعات | Circles & sectors | ✓ |
| `ch3.shade` | المساحات المظللة | Shaded areas | ✓ core |
| `ch3.solid` | المجسمات | 3D solids | |
| `ch3.coord` | الهندسة الإحداثية | Coordinate geometry | |

## Mapping rule
Question `topic` strings from source banks map to `topic_id` via
`content/taxonomy-map.json` (built during ingestion; unmapped topics get
`needs-review` flag and a HANDOFF entry — never silently misfiled).
