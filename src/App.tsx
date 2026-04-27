import { BrowserRouter as Router, Navigate, Route, Routes, useLocation } from 'react-router-dom'
import Header from './components/Header'
import Footer from './components/Footer'
import Home from './pages/Home'
import AboutUs from './pages/AboutUs'
import ContactUs from './pages/ContactUs'
import Courses from './pages/Courses'
import Accreditation from './pages/Accreditation'
import Achievements from './pages/Achievements'
import Alumni from './pages/Alumni'
import AntiRagging from './pages/AntiRagging'
import Auditorium from './pages/Auditorium'
import BDS from './pages/BDS'
import BloodDonation from './pages/BloodDonation'
import BloodDonationCamp2015 from './pages/BloodDonationCamp2015'
import Cafeteria from './pages/Cafeteria'
import CalendarOfEvents from './pages/CalendarOfEvents'
import Career from './pages/Career'
import CertificateCourseImplantology from './pages/CertificateCourseImplantology'
import ChairmansDesk from './pages/ChairmansDesk'
import Circulars from './pages/Circulars'
import Classroom from './pages/Classroom'
import Committee from './pages/Committee'
import ContactUsAcknowledgement from './pages/ContactUsAcknowledgement'
import ContactUsForBDSAdmission from './pages/ContactUsForBDSAdmission'
import DCIMandatory from './pages/DCIMandatory'
import DigitalLibrary from './pages/DigitalLibrary'
import DoctorsDay from './pages/DoctorsDay'
import EBrochure from './pages/EBrochure'
import ESI from './pages/ESI'
import ExtraCurricularActivities from './pages/ExtraCurricularActivities'
import Facilities from './pages/Facilities'
import Feedback from './pages/Feedback'
import FeesDetails202122 from './pages/FeesDetails202122'
import FellowshipForOurDean from './pages/FellowshipForOurDean'
import FreshersDay from './pages/FreshersDay'
import General from './pages/General'
import GoverningCouncil from './pages/GoverningCouncil'
import Gymnasium from './pages/Gymnasium'
import HealthCareServices from './pages/HealthCareServices'
import HLACT from './pages/HLACT'
import Hostel from './pages/Hostel'
import IIQA from './pages/IIQA'
import IQAC from './pages/IQAC'
import MakeEnquiry from './pages/MakeEnquiry'
import Management from './pages/Management'
import MaxillofacialSurgeryDepartment from './pages/MaxillofacialSurgeryDepartment'
import MDS from './pages/MDS'
import MDS1 from './pages/MDS1'
import MonthlyClinicalMeet from './pages/MonthlyClinicalMeet'
import NAAC from './pages/NAAC'
import NAACPeerTeamVisit from './pages/NAACPeerTeamVisit'
import NIRF from './pages/NIRF'
import Newsletter from './pages/Newsletter'
import NSSActivity from './pages/NSSActivity'
import OralHealth from './pages/OralHealth'
import OralHygieneDayCelebrations from './pages/OralHygieneDayCelebrations'
import Periodontology from './pages/Periodontology'
import PhD from './pages/PhD'
import PhotoGallery from './pages/PhotoGallery'
import ProstheticsCrownBridge from './pages/ProstheticsCrownBridge'
import PublicHealthDentistryGallery from './pages/PublicHealthDentistryGallery'
import Recognitions from './pages/Recognitions'
import RRDCHIsNAACAAccredited from './pages/RRDCHIsNAACAAccredited'
import Schedule from './pages/Schedule'
import SportsRecreation from './pages/SportsRecreation'
import Sports from './pages/Sports'
import SSR from './pages/SSR'
import TimeTable from './pages/TimeTable'
import TobaccoFreeIndiaCampaign from './pages/TobaccoFreeIndiaCampaign'
import Transportation from './pages/Transportation'
import Trust from './pages/Trust'
import Uncategorized from './pages/Uncategorized'
import VariousNewspapersPressRelease from './pages/VariousNewspapersPressRelease'
import VideoGallery from './pages/VideoGallery'
import VisitOfIranianCounselor from './pages/VisitOfIranianCounselor'
import VisitOfRoyalCollegeProfessorToRRDCH from './pages/VisitOfRoyalCollegeProfessorToRRDCH'
import WelcomeToYourAlmaMater from './pages/WelcomeToYourAlmaMater'
import WorldNoTobaccoDay2015 from './pages/WorldNoTobaccoDay2015'
import ACareerGuidanceProgramme from './pages/ACareerGuidanceProgramme'
import FourthSatelliteFreeDentalClinic from './pages/FourthSatelliteFreeDentalClinic'
import NineteenthGraduationDay from './pages/NineteenthGraduationDay'
import SeventeenthGraduationDay from './pages/SeventeenthGraduationDay'
import AlumniMeet from './pages/AlumniMeet'
import CurrentTrendsAndResearchProspects from './pages/CurrentTrendsAndResearchProspects'
import CurrentTrendsAndResearchProspects2 from './pages/CurrentTrendsAndResearchProspects2'
import Cultural from './pages/Cultural'
import CDEProgramme from './pages/CDEProgramme'
import OrthognathicSurgeryWorkshop from './pages/OrthognathicSurgeryWorkshop'
import StemCellsInOralCancer from './pages/StemCellsInOralCancer'
import StemCellsInOralCancer2 from './pages/StemCellsInOralCancer2'
import AQAR from './pages/AQAR'
import NewsAndEvents from './pages/NewsAndEvents'
import RRDCHRebuiltFull from './pages/RRDCHRebuiltFull'
import { LanguageProvider } from './context/LanguageContext'
import Chatbot from './components/Chatbot'
import DepartmentDetail from './pages/DepartmentDetail'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import SignIn from './pages/SignIn'
import SignUp from './pages/SignUp'
import BookAppointment from './pages/BookAppointment'
import PatientPortal from './pages/PatientPortal'

function RequireAuth({ children }: { children: JSX.Element }) {
  const { isAuthenticated, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="auth-page">
        <div className="container auth-status-card">
          <p className="eyebrow">Patient Access</p>
          <h2>Checking your session</h2>
          <p>Please wait while we confirm your sign-in before opening the appointment desk.</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    const redirectPath = `${location.pathname}${location.search}`
    return <Navigate to={`/sign-in?redirect=${encodeURIComponent(redirectPath)}`} replace />
  }

  return children
}

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="app">
            <Header />
            <main>
              <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/sign-in" element={<SignIn />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route
              path="/book-appointment"
              element={
                <RequireAuth>
                  <BookAppointment />
                </RequireAuth>
              }
            />
            <Route
              path="/portal"
              element={
                <RequireAuth>
                  <PatientPortal />
                </RequireAuth>
              }
            />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/contact-us" element={<ContactUs />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/accreditation" element={<Accreditation />} />
            <Route path="/achievements" element={<Achievements />} />
            <Route path="/alumni" element={<Alumni />} />
            <Route path="/anti-ragging" element={<AntiRagging />} />
            <Route path="/auditorium" element={<Auditorium />} />
            <Route path="/bds" element={<BDS />} />
            <Route path="/blood-donation" element={<BloodDonation />} />
            <Route path="/blood-donation-camp-2015" element={<BloodDonationCamp2015 />} />
            <Route path="/cafeteria" element={<Cafeteria />} />
            <Route path="/calendar-of-events" element={<CalendarOfEvents />} />
            <Route path="/career" element={<Career />} />
            <Route path="/certificate-course-in-implantology" element={<CertificateCourseImplantology />} />
            <Route path="/chairmans-desk" element={<ChairmansDesk />} />
            <Route path="/circulars" element={<Circulars />} />
            <Route path="/classroom" element={<Classroom />} />
            <Route path="/committee" element={<Committee />} />
            <Route path="/contact-us-acknowledgement" element={<ContactUsAcknowledgement />} />
            <Route path="/contact-us-for-bds-admission" element={<ContactUsForBDSAdmission />} />
            <Route path="/dci-mandatory" element={<DCIMandatory />} />
            <Route path="/digital-library" element={<DigitalLibrary />} />
            <Route path="/doctors-day" element={<DoctorsDay />} />
            <Route path="/e-brochure" element={<EBrochure />} />
            <Route path="/e-s-i" element={<ESI />} />
            <Route path="/extra-curricular-activities" element={<ExtraCurricularActivities />} />
            <Route path="/facilities" element={<Facilities />} />
            <Route path="/feedback" element={<Feedback />} />
            <Route path="/fees-details-2021-22" element={<FeesDetails202122 />} />
            <Route path="/fellowship-for-our-dean" element={<FellowshipForOurDean />} />
            <Route path="/freshers-day" element={<FreshersDay />} />
            <Route path="/general" element={<General />} />
            <Route path="/governing-council" element={<GoverningCouncil />} />
            <Route path="/gymnasium" element={<Gymnasium />} />
            <Route path="/health-care-services" element={<HealthCareServices />} />
            <Route path="/hlact" element={<HLACT />} />
            <Route path="/hostel" element={<Hostel />} />
            <Route path="/iiqa" element={<IIQA />} />
            <Route path="/iqac" element={<IQAC />} />
            <Route path="/make-enquiry" element={<MakeEnquiry />} />
            <Route path="/management" element={<Management />} />
            <Route path="/maxillofacial-surgery-department" element={<MaxillofacialSurgeryDepartment />} />
            <Route path="/mds" element={<MDS />} />
            <Route path="/mds1" element={<MDS1 />} />
            <Route path="/monthly-clinical-meet" element={<MonthlyClinicalMeet />} />
            <Route path="/naac" element={<NAAC />} />
            <Route path="/naac-peer-team-visit" element={<NAACPeerTeamVisit />} />
            <Route path="/nirf" element={<NIRF />} />
            <Route path="/newsletter" element={<Newsletter />} />
            <Route path="/nss-activity" element={<NSSActivity />} />
            <Route path="/oral-health" element={<OralHealth />} />
            <Route path="/oral-hygiene-day-celebrations" element={<OralHygieneDayCelebrations />} />
            <Route path="/periodontology" element={<Periodontology />} />
            <Route path="/phd" element={<PhD />} />
            <Route path="/photo-gallery" element={<PhotoGallery />} />
            <Route path="/prosthetics-crown-bridge" element={<ProstheticsCrownBridge />} />
            <Route path="/public-health-dentistry-gallery" element={<PublicHealthDentistryGallery />} />
            <Route path="/recognitions" element={<Recognitions />} />
            <Route path="/rrdch-is-naac-a-accredited" element={<RRDCHIsNAACAAccredited />} />
            <Route path="/schedule" element={<Schedule />} />
            <Route path="/sports-recreation" element={<SportsRecreation />} />
            <Route path="/sports" element={<Sports />} />
            <Route path="/ssr" element={<SSR />} />
            <Route path="/time-table" element={<TimeTable />} />
            <Route path="/tobacco-free-india-campaign" element={<TobaccoFreeIndiaCampaign />} />
            <Route path="/transportation" element={<Transportation />} />
            <Route path="/trust" element={<Trust />} />
            <Route path="/uncategorized" element={<Uncategorized />} />
            <Route path="/various-newspapers-press-release" element={<VariousNewspapersPressRelease />} />
            <Route path="/video-gallery" element={<VideoGallery />} />
            <Route path="/visit-of-iranian-counselor" element={<VisitOfIranianCounselor />} />
            <Route path="/visit-of-royal-college-professor-to-rrdch" element={<VisitOfRoyalCollegeProfessorToRRDCH />} />
            <Route path="/welcome-to-your-alma-mater" element={<WelcomeToYourAlmaMater />} />
            <Route path="/world-no-tobacco-day-2015" element={<WorldNoTobaccoDay2015 />} />
            <Route path="/a-career-guidance-programme" element={<ACareerGuidanceProgramme />} />
            <Route path="/4th-satellite-free-dental-clinic-by-rrmch" element={<FourthSatelliteFreeDentalClinic />} />
            <Route path="/19th-graduation-day" element={<NineteenthGraduationDay />} />
            <Route path="/17th-graduation-day-5-10-2012" element={<SeventeenthGraduationDay />} />
            <Route path="/alumni-meet-was-held-on-5th-june-14-at-rrdch" element={<AlumniMeet />} />
            <Route path="/current-trends-and-research-prospects-in-stomatology" element={<CurrentTrendsAndResearchProspects />} />
            <Route path="/current-trends-and-research-prospects-in-stomatology-2" element={<CurrentTrendsAndResearchProspects2 />} />
            <Route path="/cultural" element={<Cultural />} />
            <Route path="/cde-programme-oral-and-maxillofacial-surgery-department-3" element={<CDEProgramme />} />
            <Route path="/orthognathic-surgery-workshop-live-surgery-demonstration-4th-5th-mar14" element={<OrthognathicSurgeryWorkshop />} />
            <Route path="/stem-cells-in-oral-cancer" element={<StemCellsInOralCancer />} />
            <Route path="/stem-cells-in-oral-cancer-2" element={<StemCellsInOralCancer2 />} />
            <Route path="/aqar" element={<AQAR />} />
            <Route path="/news-and-events" element={<NewsAndEvents />} />
            <Route path="/departments/:slug" element={<DepartmentDetail />} />
            <Route path="/rrdch-rebuilt-full" element={<RRDCHRebuiltFull />} />
              </Routes>
            </main>
            <Footer />
            <Chatbot />
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App
