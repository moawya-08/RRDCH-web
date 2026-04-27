export type DepartmentInfo = {
  slug: string
  title: string
  officialUrl: string
  imageUrl: string
  paragraphs: [string, string]
  focusAreas: [string, string, string]
}

export const departments: DepartmentInfo[] = [
  {
    slug: 'oral-medicine-radiology',
    title: 'Oral Medicine & Radiology',
    officialUrl: 'https://www.rrdch.org/department/oral-medicine-radiology/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/Oral-Medicine-and-Radiology.jpg',
    paragraphs: [
      'The Department of Oral Medicine and Radiology serves as the entry point to dentistry for patients, handling preliminary investigation and diagnosis of dental problems, oral lesions, and systemic diseases that show oral manifestations. It also manages the dental care of medically compromised patients.',
      'RRDCH notes that the department trains UG and PG students in patient examination, diagnosis, and clinical skills, supported by a separate radiology section with advanced aids including cephalostat, orthopantomograph, T-Scan, digital OPG, RVG, and extra-oral X-ray support.'
    ],
    focusAreas: ['Oral diagnosis and medical screening', 'Advanced dental imaging and radiology', 'Training in clinical examination skills']
  },
  {
    slug: 'prosthetics-crown-bridge',
    title: 'Prosthetics & Crown & Bridge',
    officialUrl: 'https://www.rrdch.org/department/prosthetics-crown-bridge/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/Prosthetics-Crown-Bridge.jpg',
    paragraphs: [
      'The Department of Prosthetics & Crown & Bridge is responsible for replacing missing teeth and related structures lost because of congenital conditions, disease, surgery, aging, or accidents. Its work focuses not only on tooth replacement through prostheses, but also on restoring facial form and function.',
      'The department trains students in both pre-clinical and clinical prosthodontics at UG and PG levels and is also recognized as a Ph.D. centre. RRDCH highlights special work in implantology, maxillofacial prosthesis, and occlusal analysis using advanced clinical equipment.'
    ],
    focusAreas: ['Tooth and oral structure replacement', 'Implant and maxillofacial prosthetics', 'Occlusion and TM joint evaluation']
  },
  {
    slug: 'oral-maxillofacial-surgery',
    title: 'Oral & Maxillofacial Surgery',
    officialUrl: 'https://www.rrdch.org/department/oral-maxillofacial-surgery/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/Oral-and-Maxillofacial-Surgery.jpg',
    paragraphs: [
      'The Department of Oral & Maxillofacial Surgery handles surgical treatment of acquired, congenital, developmental, and traumatic conditions involving the jaws and facial region. Its scope includes facial fractures, head and neck cancers, salivary gland diseases, cysts, tumors, cleft conditions, orthognathic corrections, and TM joint disorders.',
      'RRDCH emphasizes that the department benefits from major medical infrastructure through RajaRajeswari Medical College and Hospital, including operation theatres, surgical ICUs, inpatient beds, MRI, CT, and 24-hour casualty support, while also training UG and PG students in surgical procedures.'
    ],
    focusAreas: ['Maxillofacial trauma and surgery', 'Head, neck, and salivary pathology', 'Cleft, orthognathic, and TMJ care']
  },
  {
    slug: 'periodontology',
    title: 'Periodontology',
    officialUrl: 'https://www.rrdch.org/department/periodontology/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/Periodontology1.jpg',
    paragraphs: [
      'The Department of Periodontology focuses on the treatment of gum-related problems and conditions associated with poor dental hygiene. Its training program combines theory and clinical practice for UG and PG students, covering scaling, root planing, splinting, abscess drainage, flap surgery, mucogingival surgery, and laser-assisted surgery.',
      'The official page says PG students are trained in aesthetic and regenerative procedures using advanced membranes and bone graft materials, and that the department is a recognized centre for Ph.D. programs with modern equipment and active periodontal research.'
    ],
    focusAreas: ['Gum disease treatment and prevention', 'Periodontal surgery and regeneration', 'Implant and periodontal research']
  },
  {
    slug: 'pedodontics-preventive-dentistry',
    title: 'Pedodontics & Preventive Dentistry',
    officialUrl: 'https://www.rrdch.org/department/pedodontics-preventive-dentistry/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/pedodontics-preventive-dentistry2.jpg',
    paragraphs: [
      'The Department of Pedodontics & Preventive Dentistry is focused on promoting good dental hygiene in children through preventive methods such as fluorides, deplaning procedures, and occlusal sealants. Its goal is to prevent dental caries, gingivitis, and periodontal disease while also addressing habits and developing malocclusions.',
      'RRDCH says UG and PG students gain exposure to the oral health needs of children and adolescents while providing education and preventive treatment. The department features child-friendly dental chairs, conscious sedation support, and regular school and rural outreach camps.'
    ],
    focusAreas: ['Child oral health prevention', 'Behavior and habit-related care', 'Child-friendly clinical and outreach services']
  },
  {
    slug: 'conservative-dentistry-endodontics',
    title: 'Conservative Dentistry & Endodontics',
    officialUrl: 'https://www.rrdch.org/department/conservative-dentistry-endodontics/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/Conservative-Dentistry-Endodontics.jpg',
    paragraphs: [
      'The Department of Conservative Dentistry & Endodontics describes its mission as increasing the life span of teeth. The page lists services and training in root canal treatment, endodontic surgery, metallic and non-metallic restorations, aesthetic restorations, regenerative endodontics, and traumatic injury management.',
      'RRDCH highlights facilities such as vista scan, thermoplasticized gutta percha systems, rotary endodontics, LED curing, endosonics, ceramics lab support, and Waterlase hard-tissue laser systems that support more precise and less invasive procedures.'
    ],
    focusAreas: ['Tooth preservation and restoration', 'Root canal and microsurgical care', 'Laser-assisted aesthetic dentistry']
  },
  {
    slug: 'orthodontics-dentofacial-orthopedics',
    title: 'Orthodontics & Dentofacial Orthopedics',
    officialUrl: 'https://www.rrdch.org/department/orthodontics-dento-facial-orthopedics/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/Orthodontics-Dento-Facial-Orthopedics.jpg',
    paragraphs: [
      'The Department of Orthodontics & Dentofacial Orthopedics specializes in correcting jaw and tooth defects using removable and fixed appliances. Treatments include pre-adjusted edgewise appliances, lingual appliances, ceramic braces, myofunctional appliances, clear aligners, surgical orthodontics, and micro-implant based orthodontics.',
      'RRDCH says the department has separate UG and PG clinics connected to a central server, advanced digital imaging and treatment simulation tools, and recognition as a Ph.D. centre with strong emphasis on digital diagnosis and research.'
    ],
    focusAreas: ['Braces, aligners, and appliance therapy', 'Digital diagnosis and treatment planning', 'Orthodontic research and advanced training']
  },
  {
    slug: 'public-health-dentistry',
    title: 'Public Health Dentistry',
    officialUrl: 'https://www.rrdch.org/department/public-health-dentistry/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/Public-Health-Dentistry.jpg',
    paragraphs: [
      'The Department of Public Health Dentistry is oriented toward communities that lack dental health facilities, with the aim of expanding oral healthcare access through outreach. The department uses rural dental camps, adopted satellite centres, audiovisual education, and referral support.',
      'RRDCH notes that UG and PG students gain grassroots experience by working with underserved populations. The department operates a modern mobile dental clinic, four permanent satellite centres, and regularly promotes oral health education in community settings.'
    ],
    focusAreas: ['Community oral health outreach', 'Mobile and satellite dental services', 'Preventive education and referrals']
  },
  {
    slug: 'oral-maxillofacial-pathology',
    title: 'Oral & Maxillofacial Pathology',
    officialUrl: 'https://www.rrdch.org/department/oral-pathology-microbiology/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/Oral-Pathology-Microbiology.jpg',
    paragraphs: [
      'The Department of Oral & Maxillofacial Pathology focuses on the nature, identification, and management of diseases affecting the oral and maxillofacial region and related structures. RRDCH describes it as a specialty linking basic sciences and clinical dentistry.',
      'The page also says the department is active in research on HIV-AIDS, laser-induced wound healing, karyotyping, molecular studies, oral cancer, and microbiological aspects of oral infections, supported by pathology labs, microscopes, and a large specimen museum.'
    ],
    focusAreas: ['Oral disease diagnosis and pathology', 'Histopathology and microbiology training', 'Oral cancer and molecular research']
  },
  {
    slug: 'implantology',
    title: 'Implantology',
    officialUrl: 'https://www.rrdch.org/department/implantology/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2013/05/pedodontics-preventive-dentistry1.jpg',
    paragraphs: [
      'RRDCH presents Implantology as an emerging super-specialty in dentistry that functions as an independent department with specialists from allied co-specialties. The department also conducts a one-year Rajiv Gandhi University of Health Sciences certificate programme in implantology.',
      'It provides permanent replacements for prematurely lost teeth and is equipped with modern implant surgical kits, a physio dispenser, and advanced surgical equipment for single and multiple tooth replacement, implant-supported dentures, full mouth rehabilitation, sinus lift procedures, and zygomatic implants.'
    ],
    focusAreas: ['Dental implant replacement solutions', 'Full-mouth and denture-supported rehab', 'Advanced surgical implant procedures']
  },
  {
    slug: 'research-publication',
    title: 'Research & Publication',
    officialUrl: 'https://www.rrdch.org/department/research-publication/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2018/09/rrdch-logo.png',
    paragraphs: [
      'The Research & Publication Department is described by RRDCH as an active institutional unit that supports multiple research projects undertaken by staff and students. The page highlights the presence of a Real Time PCR facility that supports research activity across the institution.',
      'RRDCH also publishes an indexed scientific journal called the Journal of Health Sciences and Research, positioning the department within a broader academic and publication-focused research environment.'
    ],
    focusAreas: ['Faculty and student research projects', 'Real Time PCR-based research support', 'Scientific publishing and journal activity']
  },
  {
    slug: 'orofacial-pain',
    title: 'Orofacial Pain',
    officialUrl: 'https://www.rrdch.org/department/orofacial-pain/',
    imageUrl: 'https://www.rrdch.org/rrdch/wp-content/uploads/2018/09/rrdch-logo.png',
    paragraphs: [
      'The Orofacial Pain department is a specially created unit dedicated to investigating and treating orofacial pain conditions. According to the official page, it handles all types of orofacial and temporomandibular pain dysfunction, including migraine-related cases.',
      'RRDCH lists equipment such as T-Scan, EMG, Jaw Tracker, and TENS, with Cone Beam CT and OPG support for imaging and assessment. The department is positioned as a focused pain-management service for complex facial pain disorders.'
    ],
    focusAreas: ['Orofacial and TMJ pain care', 'Migraine-related facial pain assessment', 'T-Scan, EMG, and imaging-supported diagnosis']
  }
]

export const departmentMap = Object.fromEntries(departments.map((department) => [department.slug, department])) as Record<string, DepartmentInfo>
