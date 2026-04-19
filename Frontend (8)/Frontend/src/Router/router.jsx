import React, { lazy, Suspense } from "react";
import { createBrowserRouter } from "react-router-dom";
import Loader from "../HomeCompontent/Loader.jsx";

// Loading component for Suspense
const PageLoader = () => (
  <div style={{ height: '100vh', display: 'flex', alignItems: 'center', background: '#fff' }}>
    <Loader />
  </div>
);

// Layouts
import App from "../MainCompontent/App.jsx";
import Adminlayout from "../Admin/Adminlayout.jsx";
import UserProtectedRoute from "../User/UserProtectedRoute.jsx";
import AdminProtectedRoute from "../Dashboard/Compontent/AdminProtectedRoute.jsx";

// Main Pages
import Homepage from "../Homepage.jsx";
const Destinations = lazy(() => import("../HomeCompontent/Destinations.jsx"));
const LandingPage = lazy(() => import("../HomeCompontent/LandingPage.jsx"));
const ThankYou = lazy(() => import("../HomeCompontent/ThankYou.jsx"));
const Shop = lazy(() => import("../HomeCompontent/Shopwithus.jsx"));
const Contact = lazy(() => import("../Page/Contact.jsx"));
const About = lazy(() => import("../Page/About.jsx"));
const Testimonials = lazy(() => import("../Page/Testimonials.jsx"));
const Business = lazy(() => import("../Page/Business.jsx"));
const FeedbackForm = lazy(() => import("../Page/FeedbackForm.jsx"));
const Register = lazy(() => import("../User/Register.jsx"));
const Login = lazy(() => import("../User/Login.jsx"));
const ForgetPassword = lazy(() => import("../User/ForgotPassword.jsx"));
const ResetPassword = lazy(() => import("../User/ResetPassword.jsx"));
const Enquiry = lazy(() => import("../Page/Enquiry.jsx"));
const BlogPage = lazy(() => import("../Page/BlogPage.jsx"));
const BlogDetails = lazy(() => import("../Page/BlogDetails.jsx"));
const State = lazy(() => import("../Page/State.jsx"));
const CountryState = lazy(() => import("../Page/CountryState.jsx"));
const TourDetails = lazy(() => import("../Page/TourDetails.jsx"));
const CountryTourDetails = lazy(() => import("../Page/CountryTourDetails.jsx"));
const PrivacyPolicy = lazy(() => import("../Page/PrivacyPolicy.jsx"));
const TermsCondition = lazy(() => import("../Page/TermsCondition.jsx"));
const Payment = lazy(() => import("../Page/Payment.jsx"));
const LandingTourPage = lazy(() => import("../Page/LandingTourPage.jsx"));
const PageNotFound = lazy(() => import("../Page/PageNotFound.jsx"));
const ExploreTours = lazy(() => import("../Page/ExploreTours.jsx"));
const UpcomingLanding = lazy(() => import("../Page/UpcomingLanding.jsx"));
const UpcomingDetails = lazy(() => import("../Page/UpcomingDetails.jsx"));

// Admin Components
const AdminLogin = lazy(() => import("../Admin/AdminLogin.jsx"));
const DashboardHome = lazy(() => import("../Dashboard/Compontent/DashboardHome.jsx"));
const AdminDashboard = lazy(() => import("../Dashboard/page/AdminDashboard.jsx"));
const AdminBlog = lazy(() => import("../Dashboard/page/AdminBlog.jsx"));
const AdminFeedback = lazy(() => import("../Dashboard/page/AdminFeedback.jsx"));
const CatagoryIndia = lazy(() => import("../Dashboard/page/CatagoryIndia.jsx"));
const AdminState = lazy(() => import("../Dashboard/page/AdminState.jsx"));
const AdminAsia = lazy(() => import("../Dashboard/page/Adminasia.jsx"));
const AdminTours = lazy(() => import("../Dashboard/page/AdminTours.jsx"));
const AdminCountry = lazy(() => import("../Dashboard/page/AdminCountry.jsx"));
const AdminFaqState = lazy(() => import("../Dashboard/page/AdminFaqState.jsx"));
const AdminFaqCountry = lazy(() => import("../Dashboard/page/AdminFaqCountry.jsx"));
const UserManagement = lazy(() => import("../Dashboard/page/UserManagement.jsx"));
const AdminEnquiry = lazy(() => import("../Dashboard/page/AdminEnquiry.jsx"));
const AdminAsiaState = lazy(() => import("../Dashboard/page/AdminAsiaState.jsx"));
const AdminContact = lazy(() => import("../Dashboard/page/AdminContact.jsx"));
const AdminEdit = lazy(() => import("../Dashboard/page/AdminEdit.jsx"));
const AdminTheme = lazy(() => import("../Dashboard/page/AdminTheme.jsx"));
const AdminPayments = lazy(() => import("../Dashboard/page/AdminPayments.jsx"));
const AdminBussianContent = lazy(() => import("../Dashboard/page/AdminBussianContent.jsx"));
const AdminUpcomingTrips = lazy(() => import("../Dashboard/page/AdminUpcomingTrips.jsx"));

// User Components
const UserdHome = lazy(() => import("../User/Dashboard/UserHome.jsx"));
const UserDashboard = lazy(() => import("../User/Dashboard/UserDashboard.jsx"));
const Profile = lazy(() => import("../User/Dashboard/Profile.jsx"));
const UserEdit = lazy(() => import("../User/Dashboard/UserEdit.jsx"));
const Announcements = lazy(() => import("../User/Dashboard/Announcements.jsx"));
const PaymentModel = lazy(() => import("../User/Dashboard/PaymentModel.jsx"));
const UserDocument = lazy(() => import("../User/UserDocument.jsx"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><Homepage /></Suspense> },
      { path: "destinations", element: <Suspense fallback={<PageLoader />}><Destinations /></Suspense> },
      { path: "shop", element: <Suspense fallback={<PageLoader />}><Shop /></Suspense> },
      { path: "contact-us", element: <Suspense fallback={<PageLoader />}><Contact /></Suspense> },
      { path: "about-us", element: <Suspense fallback={<PageLoader />}><About /></Suspense> },
      { path: "testimonials", element: <Suspense fallback={<PageLoader />}><Testimonials /></Suspense> },
      { path: "business-with-us", element: <Suspense fallback={<PageLoader />}><Business /></Suspense> },
      { path: "register", element: <Suspense fallback={<PageLoader />}><Register /></Suspense> },
      { path: "login", element: <Suspense fallback={<PageLoader />}><Login /></Suspense> },
      { path: "enquiry-form", element: <Suspense fallback={<PageLoader />}><Enquiry /></Suspense> },
      { path: "feedback-form", element: <Suspense fallback={<PageLoader />}><FeedbackForm /></Suspense> },
      { path: "forgot-password", element: <Suspense fallback={<PageLoader />}><ForgetPassword /></Suspense> },
      { path: "reset-password/:token", element: <Suspense fallback={<PageLoader />}><ResetPassword /></Suspense> },
      { path: "blogpage", element: <Suspense fallback={<PageLoader />}><BlogPage /></Suspense> },
      { path: "blog/:id", element: <Suspense fallback={<PageLoader />}><BlogDetails /></Suspense> },
      { path: "india-tours/state/:stateId/:stateName", element: <Suspense fallback={<PageLoader />}><State /></Suspense> },
      { path: "india-tours/:stateId/:stateName", element: <Suspense fallback={<PageLoader />}><State /></Suspense> },
      { path: "asia-tours/:countryId", element: <Suspense fallback={<PageLoader />}><CountryState /></Suspense> },
      { path: "tour/:tourId", element: <Suspense fallback={<PageLoader />}><TourDetails /></Suspense> },
      { path: "country/:countryId/:asiastateId/:stateName", element: <Suspense fallback={<PageLoader />}><CountryTourDetails /></Suspense> },
      { path: "privacypolicy", element: <Suspense fallback={<PageLoader />}><PrivacyPolicy /></Suspense> },
      { path: "termscondition", element: <Suspense fallback={<PageLoader />}><TermsCondition /></Suspense> },
      { path: "payment", element: <Suspense fallback={<PageLoader />}><Payment /></Suspense> },
      { path: "landing-pages/:slug", element: <Suspense fallback={<PageLoader />}><LandingTourPage /></Suspense> },
      { path: "explore", element: <Suspense fallback={<PageLoader />}><ExploreTours /></Suspense> },
      { path: "upcoming", element: <Suspense fallback={<PageLoader />}><UpcomingLanding /></Suspense> },
      { path: "upcoming/:id", element: <Suspense fallback={<PageLoader />}><UpcomingDetails /></Suspense> },
    ],
  },
  { path: "/landingpage", element: <Suspense fallback={<PageLoader />}><LandingPage /></Suspense> },
  { path: "/thankyou", element: <Suspense fallback={<PageLoader />}><ThankYou /></Suspense> },
  {
    path: "/admin",
    element: <Adminlayout />,
    children: [
      { index: true, element: <Suspense fallback={<PageLoader />}><AdminLogin /></Suspense> },
      {
        path: "dashboard",
        element: (
          <AdminProtectedRoute>
            <Suspense fallback={<PageLoader />}><DashboardHome /></Suspense>
          </AdminProtectedRoute>
        ),
        children: [
          { index: true, element: <Suspense fallback={<PageLoader />}><AdminDashboard /></Suspense> },
          { path: "adminblog", element: <Suspense fallback={<PageLoader />}><AdminBlog /></Suspense> },
          { path: "adminfeedback", element: <Suspense fallback={<PageLoader />}><AdminFeedback /></Suspense> },
          { path: "catagoryindia", element: <Suspense fallback={<PageLoader />}><CatagoryIndia /></Suspense> },
          { path: "Itinerary", element: <Suspense fallback={<PageLoader />}><AdminState /></Suspense> },
          { path: "adminasia", element: <Suspense fallback={<PageLoader />}><AdminAsia /></Suspense> },
          { path: "admintours", element: <Suspense fallback={<PageLoader />}><AdminTours /></Suspense> },
          { path: "admincountry", element: <Suspense fallback={<PageLoader />}><AdminCountry /></Suspense> },
          { path: "adminfaq", element: <Suspense fallback={<PageLoader />}><AdminFaqState /></Suspense> },
          { path: "adminfaqcountry", element: <Suspense fallback={<PageLoader />}><AdminFaqCountry /></Suspense> },
          { path: "usermanagement", element: <Suspense fallback={<PageLoader />}><UserManagement /></Suspense> },
          { path: "adminenquiry", element: <Suspense fallback={<PageLoader />}><AdminEnquiry /></Suspense> },
          { path: "adminasiastate", element: <Suspense fallback={<PageLoader />}><AdminAsiaState /></Suspense> },
          { path: "admincontact", element: <Suspense fallback={<PageLoader />}><AdminContact /></Suspense> },
          { path: "adminprofile", element: <Suspense fallback={<PageLoader />}><AdminEdit /></Suspense> },
          { path: "adminPayments", element: <Suspense fallback={<PageLoader />}><AdminPayments /></Suspense> },
          { path: "AdminBussianContent", element: <Suspense fallback={<PageLoader />}><AdminBussianContent /></Suspense> },
          { path: "admintheme", element: <Suspense fallback={<PageLoader />}><AdminTheme /></Suspense> },
          { path: "upcoming-trips", element: <Suspense fallback={<PageLoader />}><AdminUpcomingTrips /></Suspense> },
        ],
      },
    ],
  },
  {
    path: "/user",
    element: <UserProtectedRoute />,
    children: [
      {
        element: <Suspense fallback={<PageLoader />}><UserdHome /></Suspense>,
        children: [
          { index: true, element: <Suspense fallback={<PageLoader />}><UserDashboard /></Suspense> },
          { path: "profile", element: <Suspense fallback={<PageLoader />}><Profile /></Suspense> },
          { path: "edit", element: <Suspense fallback={<PageLoader />}><UserEdit /></Suspense> },
          { path: "announcement", element: <Suspense fallback={<PageLoader />}><Announcements /></Suspense> },
          { path: "PaymentModel", element: <Suspense fallback={<PageLoader />}><PaymentModel /></Suspense> },
          { path: "UserDocument", element: <Suspense fallback={<PageLoader />}><UserDocument /></Suspense> },
        ],
      },
    ],
  },
  { path: "*", element: <Suspense fallback={<PageLoader />}><PageNotFound /></Suspense> },
]);

export default router;
