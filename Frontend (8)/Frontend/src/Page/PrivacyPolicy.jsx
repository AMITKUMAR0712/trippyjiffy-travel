import React from "react";
import Style from "../Style/PrivacyPolicy.module.scss";
import { Helmet } from "react-helmet-async";

const PrivacyPolicy = () => {
  return (
    <div className={Style.PrivacyPolicy}>
      {/* ⭐ DYNAMIC HELMET FOR SEO ⭐ */}
     <Helmet>
  <title>
    Privacy Policy – TrippyJiffy | Your Data, Our Responsibility
  </title>

  <meta
    name="description"
    content="Read the Privacy Policy of TrippyJiffy. Learn how we collect, use, store, and protect your personal information when you use our travel services."
  />

  <meta name="robots" content="index, follow" />

  {/* ✅ CANONICAL URL */}
  <link
    rel="canonical"
    href="https://trippyjiffy.com/privacypolicy"
  />
</Helmet>


      <h1>TrippyJiffy Company Policies</h1>
      <h2>Last Updated on : 18 Nov 2025</h2>

      <section>
        <h3>1. INTRODUCTION</h3>
        <p>
       TrippyJiffy (“Company”) values the privacy of its users and is committed to protecting the personal information shared by its users. As a responsible data controller and processor, TrippyJiffy adheres to strict privacy standards and practices.
        </p>
        <p>
          This Privacy Policy applies to all individuals, including travel agents (“User”), who interact with TrippyJiffy through any of our customer interface channels. These channels include our Website, mobile sites, Whatsapp and all Social Media Platforms, and offline channels (collectively referred to as “Sales Channels”). For this Privacy Policy, the term “Website” refers to all online properties owned and operated by TrippyJiffy, including our main website https://www. TrippyJiffy.com/, mobile site and Social media Platforms
        </p>
        <p>References to “you” and “your” in this Privacy Policy mean the User, while “we,” “us,” and “our” refer to TrippyJiffy.</p>
        <p>This Privacy Policy governs the collection, use, storage, disclosure, and protection of your personal information by TrippyJiffy. By using or accessing our Website or other Sales Channels, you agree to the terms outlined in this Privacy Policy. If you do not agree with any part of this Privacy Policy, please do not use our Website or services.</p>
        <p>Please note that this Privacy Policy does not apply to third-party websites, mobile sites, or mobile apps, even if they are linked to our Website. We recommend that you review the privacy policies of any third-party sites you visit.</p>
      </section>

      <section>
        <h3>2. PERSONAL INFORMATION THAT WE COLLECT</h3>
        <p>“Personal Information” refers to any information that relates to you and is provided by you to us through our Sales Channels. This information may include, but is not limited to:
</p>
        <ul>
          <li>Identity Information: Such as your name, gender, marital status, religion, age, etc.
</li>
          <li>Contact Information: Including your email addresses, postal addresses, telephone numbers, etc.</li>
          <li>Travel Information: Details of other travellers for whom you make bookings through your account, passport details, driving license information (if applicable), and other travel-related documents.</li>
         
        </ul>
        <p>We may also collect data that is publicly available or obtained from third-party sources, including social media platforms.</p>
      </section>

      <section>
        <h3>3. COLLECTION AND USE OF YOUR PERSONAL INFORMATION</h3>
        <p>TrippyJiffy  collects and uses your Personal Information only as necessary to conduct our business and to provide you with the services you request through our Sales Channels. This information is collected for the following purposes:</p>
        <ul>
          <li>To provide the services requested by you.</li>
          <li>To communicate with you regarding your bookings, services, or special offers.</li>
          <li>To send booking confirmations, updates, or changes to your itinerary.</li>
          <li>To customize your experience on our Website, mobile sites.</li>
          <li>To perform marketing and promotional activities</li>
          <li>To verify and authenticate your account and prevent fraud or misuse.</li>
          <li>To respond to your queries and provide customer support.</li>
          <li>To allow third-party service providers, such as hotels, airlines, or transportation services, to contact you if required.</li>
        </ul>
        <p>By providing your Personal Information, you consent to its processing as described in this Privacy Policy. It is your responsibility to ensure that the information you provide is accurate, complete, and up-to-date.</p>
      </section>

      <section>
        <h3>4. CONSENT TO OBTAIN PERSONAL INFORMATION</h3>
        <p>
        By using our Website, you consent to the collection and processing of your Personal Information by TrippyJiffy for the purposes described in this Privacy Policy. You have the right to withdraw your consent at any time. However, withdrawing consent may affect your ability to use our Website and services, and your account may be deactivated.
        </p>
        <p>You must be of legal age (as defined by applicable laws) to provide consent for the collection and processing of your Personal Information. If you are submitting information on behalf of a minor or someone who cannot legally provide consent, you must have the appropriate legal authority to do so.</p>
      </section>

      <section>
        <h3>5. DISCLOSURE OF PERSONAL INFORMATION</h3>
        <p>Your Personal Information may be disclosed under the following circumstances</p>
        <ul>
          <li>Third-Party Service Providers: To facilitate the services you request, we may share your information with third-party providers. However, TrippyJiffy is not responsible for the privacy practices of these third parties.</li>
          <li>Legal Obligations: We may disclose your information to comply with applicable laws, regulations, or legal processes, or to protect our rights or the rights of others.</li>
          <li>
         Business Partners: To our business partners, subsidiaries, or affiliates who maintain adequate privacy policies.
          </li>
          <li>
      Other Circumstances: With your consent or when necessary to protect TrippyJiffy’s  legitimate interests, prevent fraud, or ensure the safety of our Users.
          </li>
        </ul>
      </section>

      <section>
        <h3>6. SECURITY OF PERSONAL INFORMATION</h3>
        <p>
        TrippyJiffy  takes the security of your Personal Information seriously and implements stringent measures to protect it from unauthorized access, misuse, or disclosure
        </p>
      </section>

      <section>
        <h3>7. AMENDMENTS</h3>
        <p>
       TrippyJiffy reserves the right to update or revise this Privacy Policy as needed to reflect changes in legal requirements, business practices, or customer needs. Significant changes will be communicated via email or a notice on our Website.
        </p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
