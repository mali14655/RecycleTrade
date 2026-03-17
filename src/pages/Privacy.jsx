import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            {/* Logo and Name - Responsive like Login/Register pages */}
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 mb-6">
              <img 
                src={logo} 
                alt="F&s Smartphones" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg shrink-0"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-center">
                Privacy Policy
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-4 sm:mt-6 px-4">
              Protecting your privacy is very important to us
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
            {/* Controller Information */}
            <section className="mb-6 sm:mb-8 pb-6 border-b border-gray-200">
              <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                The controller responsible for data processing is:
              </h2>
              <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-2">
                <p>
                  <strong>Fahad Shah Lalpurwal</strong>
                </p>
                <p>
                  <strong>F&s Smartphones</strong>
                  <br />
                  Q1 5-6
                  <br />
                  68161 Mannheim
                </p>
                <p>
                  <strong>Email:</strong>{" "}
                  <a
                    href="mailto:F-und-ssmartphones@web.de"
                    className="text-blue-600 hover:underline"
                  >
                    F-und-ssmartphones@Web.de
                  </a>
                </p>
                <p>
                  <strong>Telephone:</strong>{" "}
                  <a
                    href="tel:+4917680312302"
                    className="text-blue-600 hover:underline"
                  >
                    017680312302
                  </a>
                </p>
              </div>
            </section>

            <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-6 sm:mb-8">
              We appreciate your interest in our website. Protecting your privacy is very important to us. Below, we provide detailed information about how we handle your data.
            </p>

            <div className="prose prose-lg max-w-none">
              {/* 1. Access data and hosting */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  1. Access data and hosting
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  You can visit our website without providing any personal information. Each time a webpage is accessed, the web server automatically saves a so-called server log file, which contains information such as the name of the requested file, your IP address, the date and time of access, the amount of data transferred, and the requesting provider (access data), and documents the access. This access data is evaluated solely for the purpose of ensuring the smooth operation of the website and improving our services. This serves our legitimate interests, which outweigh any conflicting interests, in the correct presentation of our services in accordance with Art. 6 Para. 1 Sentence 1 lit. f GDPR. All access data is processed only as long as necessary to achieve the aforementioned processing purposes.
                </p>

                <div className="mt-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    1.1 Hosting
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    The services for hosting and displaying this website are partly provided by our service providers as part of data processing on our behalf. Unless otherwise stated in this privacy policy, all access data and all data collected via forms provided on this website are processed on their servers. For questions about our service providers and the basis of our cooperation with them, please contact us using the contact details provided in this privacy policy.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    Our service providers are located in and/or use servers in the following countries, for which the European Commission has determined an adequate level of data protection: USA.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    The adequacy decision for the USA serves as the basis for data transfers to third countries, provided the respective service provider is certified. Such certification exists.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    Our service providers are located and/or use servers in countries outside the EU and the EEA. These countries do not have an adequacy decision from the European Commission. Our cooperation with them is based on standard data protection clauses issued by the European Commission.
                  </p>
                </div>

                <div className="mt-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    1.2 Content Delivery Network
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    To reduce loading times, we use a Content Delivery Network (CDN) for some of our services. This service delivers content, such as large media files, via regionally distributed servers of external CDN providers. Therefore, access data is processed on these providers' servers. Our service providers act as data processors on our behalf. If you have any questions about our service providers and the basis of our cooperation with them, please contact us using the contact information provided in this privacy policy.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    Our service providers are located in and/or use servers in the following countries, for which the European Commission has determined an adequate level of data protection: USA.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    The adequacy decision for the USA serves as the basis for data transfers to third countries, provided the respective service provider is certified. Such certification is in place.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    Our service providers are located and/or use servers in countries outside the EU and the EEA. These countries do not have an adequacy decision from the European Commission. Our cooperation with them is based on standard data protection clauses issued by the European Commission.
                  </p>
                </div>
              </section>

              {/* 2. Data processing for contract fulfillment and contact purposes */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  2. Data processing for contract fulfillment and contact purposes
                </h2>

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    2.1 Data processing for contract fulfillment
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    We collect personal data when you voluntarily provide it to us as part of your order or when contacting us (e.g., via contact form or email). Required fields are marked as such because we need this data to process your order or your inquiry, and you cannot complete your order or send your inquiry without providing it. The specific data collected is evident from the respective input forms.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    We use the data you provide for contract processing and handling your inquiries (including inquiries regarding and processing of any warranty and service disruption claims, as well as any legal update obligations) in accordance with Article 6 Paragraph 1 Sentence 1 Letter b GDPR. Further information on the processing of your data, in particular its transfer to our service providers for order, payment, and shipping purposes, can be found in the following sections of this privacy policy. After complete fulfillment of the contract, your data will be restricted from further processing and deleted after the expiry of any tax and commercial law retention periods in accordance with Art. 6 Para. 1 Sentence 1 lit. c GDPR, unless you have expressly consented to further use of your data in accordance with Art. 6 Para. 1 Sentence 1 lit. a GDPR or we reserve the right to further data use that is legally permitted and about which we inform you in this declaration.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    2.2 Contact
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    As part of our customer communication, we collect personal data to process your inquiries in accordance with Article 6 Paragraph 1 Sentence 1 Letter b of the GDPR, if you voluntarily provide this data to us when contacting us (e.g., via contact form or email). Required fields are marked as such, as we absolutely need this data to process your inquiry. The specific data collected is evident from the respective input forms. After your inquiry has been fully processed, your data will be deleted unless you have expressly consented to further use of your data in accordance with Article 6 Paragraph 1 Sentence 1 Letter a of the GDPR, or we reserve the right to use your data beyond this scope, which is legally permissible and about which we inform you in this statement.
                  </p>
                </div>
              </section>

              {/* 3. Data processing for the purpose of order fulfillment */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  3. Data processing for the purpose of order fulfillment
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  For the purpose of fulfilling the contract pursuant to Art. 6 para. 1 sentence 1 lit. b GDPR, we will forward your data to the shipping service provider commissioned with the delivery, insofar as this is necessary for the delivery of ordered goods. If you have any questions about our service providers and the basis of our cooperation with them, please contact us using the contact details provided in this privacy policy.
                </p>

                <div className="mt-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    3.1 Data transfer to shipping service providers for the purpose of shipping notification
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    If you have given us your express consent during or after your order, we will, based on this consent pursuant to Art. 6 para. 1 sentence 1 lit. a GDPR, forward your email address to the selected shipping provider so that they can contact you before delivery for the purpose of delivery notification or coordination. You can revoke your consent at any time by sending a message to the contact details provided in this privacy policy or directly to the shipping provider at the contact address listed below. After revocation, we will delete the data you provided for this purpose, unless you have expressly consented to further use of your data or we reserve the right to use your data beyond this scope, which is permitted by law and about which we inform you in this policy. If you have any questions about our service providers and the basis of our cooperation with them, please contact us using the contact details provided in this privacy policy.
                  </p>
                </div>
              </section>

              {/* 4. Data processing for payment processing */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  4. Data processing for payment processing
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  When processing payments in our online shop, we work together with the following partners: technical service providers, credit institutions, payment service providers.
                </p>

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    4.1 Data processing for transaction processing
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    <strong>Online Payments (Home Delivery Orders):</strong> For online payments, we use <strong>Stripe</strong> as our payment service provider. When you place a home delivery order, we forward the data necessary for processing the payment transaction (order details, total amount, customer email) to Stripe. Stripe processes card payments securely on their platform. We do not store or have access to your full card details - these are handled directly by Stripe through their secure checkout system. This serves the purpose of fulfilling the contract pursuant to Art. 6 para. 1 sentence 1 lit. b GDPR. Stripe collects the card payment data required for processing the payment on their own secure website (Stripe Checkout). In this respect, Stripe's data protection policy applies. You can find Stripe's privacy policy at: <a href="https://stripe.com/privacy" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://stripe.com/privacy</a>.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    <strong>Pickup Orders:</strong> For orders collected from our outlet locations, no online payment is processed. Payment is made when you collect your order from the selected outlet. Therefore, no payment data is transmitted to payment service providers for pickup orders.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    <strong>PayPal:</strong> We also offer PayPal as a payment method. When you choose to pay with PayPal, your payment data is processed by PayPal (Europe) S.à r.l. et Cie, S.C.A., 22-24 Boulevard Royal, L-2449 Luxembourg. PayPal processes the payment on their own secure platform. In this respect, PayPal's data protection policy applies. You can find PayPal's privacy policy at: <a href="https://www.paypal.com/de/webapps/mpp/ua/privacy-full" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://www.paypal.com/de/webapps/mpp/ua/privacy-full</a>.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    <strong>Future Payment Methods:</strong> We may add additional payment methods in the future. Any new payment methods will be clearly displayed during checkout, and their respective data protection policies will apply.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    Data may be transferred to third countries outside the EU/EEA (specifically to the USA where Stripe's and PayPal's servers are located) for which the European Commission has determined an adequate level of data protection. Where data is transferred to third countries outside the EU/EEA for which the European Commission has not issued an adequacy decision, cooperation is based on standard data protection clauses of the European Commission.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    If you have any questions about our payment processing partners or the basis of our cooperation with them, please contact us using the contact details provided in this privacy policy.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    4.2 Data processing for the purpose of fraud prevention and optimization of our payment processes
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    Where necessary, we will provide the aforementioned service providers with further data, which they will use together with the data required for processing the payment for the purposes of fraud prevention and optimizing our payment processes (e.g., invoicing, processing disputed payments, supporting accounting). This serves our legitimate interests in protecting ourselves against fraud and in efficient payment management, which, in accordance with Article 6(1)(f) GDPR, override any conflicting interests.
                  </p>
                </div>
              </section>

              {/* 5. Cookies and other technologies */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  5. Cookies and other technologies
                </h2>

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    5.1 General Information
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    To make your visit to our website more attractive and to enable the use of certain functions, we use various technologies, including so-called cookies, on different pages. Cookies are small text files that are automatically stored on your device. Some of the cookies we use are deleted after the end of your browser session, i.e., after you close your browser (session cookies). Other cookies remain on your device and allow us to recognize your browser on your next visit (persistent cookies). You can find information about the storage duration in the overview in your web browser's cookie settings.
                  </p>

                  <div className="mt-3">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">Privacy protection on end devices</h4>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      When you use our online services, we employ essential technologies to provide the explicitly requested telemedia service. Storing information on your device or accessing information already stored on your device does not require your consent.
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      For functions that are not strictly necessary, storing information on your device or accessing information already stored on your device requires your consent. Please note that if you do not grant your consent, some parts of the website may not be fully functional. Any consent you have given will remain valid until you adjust or reset the relevant settings on your device.
                    </p>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">Any subsequent data processing through cookies and other technologies</h4>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      We use technologies that are essential for the use of certain functions on our website. These technologies collect and process your IP address, the time of your visit, device and browser information, and information about your use of our website. This serves our overriding legitimate interests in optimizing the presentation of our services, in accordance with Article 6(1)(f) of the GDPR.
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      Furthermore, we use technologies to fulfill our legal obligations (e.g., to be able to demonstrate consent to the processing of your personal data) as well as for web analytics and online marketing. You can find further information on this, including the respective legal basis for data processing, in the following sections of this privacy policy.
                    </p>
                  </div>

                  <div className="mt-3">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">Cookie settings</h4>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      You can find the cookie settings for your browser at the following links: Microsoft Edge™ / Safari™ / Chrome™ / Firefox™ / Opera™
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      If you have consented to the use of these technologies in accordance with Article 6(1)(a) of the GDPR, you can withdraw your consent at any time by contacting us using the contact details provided in the privacy policy. Please note that if you do not accept cookies, the functionality of our website may be limited.
                    </p>
                  </div>
                </div>
              </section>

              {/* 6. Contact options and your rights */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  6. Contact options and your rights
                </h2>

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    6.1 Your rights
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    As an affected party, you have the following rights:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-2 mb-3 sm:mb-4">
                    <li>In accordance with Article 15 GDPR, you have the right to request information about your personal data processed by us to the extent specified therein;</li>
                    <li>In accordance with Article 16 GDPR, you have the right to request the immediate rectification of inaccurate personal data or the completion of incomplete personal data stored by us;</li>
                    <li>In accordance with Article 17 of the GDPR, you have the right to request the erasure of your personal data stored by us, unless further processing is necessary to exercise the right to freedom of expression and information, to fulfill a legal obligation, for reasons of public interest, or necessary for the establishment, exercise or defense of legal claims;</li>
                    <li>According to Article 18 GDPR, you have the right to request the restriction of the processing of your personal data, insofar as the accuracy of the data is disputed by you, the processing is unlawful, but you object to its deletion, we no longer need the data, but you require it for the establishment, exercise or defense of legal claims, or you have objected to the processing pursuant to Article 21 GDPR;</li>
                    <li>In accordance with Article 20 GDPR, you have the right to receive your personal data that you have provided to us in a structured, commonly used and machine-readable format or to request its transmission to another controller;</li>
                    <li>According to Article 77 of the GDPR, you have the right to lodge a complaint with a supervisory authority. Generally, you can contact the supervisory authority of your habitual residence, your place of work, or the location of our company headquarters.</li>
                  </ul>

                  <div className="mt-4">
                    <h4 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">Right to object</h4>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      To the extent that we process personal data as explained above to protect our overriding legitimate interests within the framework of a balancing of interests, you may object to this processing with effect for the future. If the processing is for direct marketing purposes, you may exercise this right at any time as described above. If the processing is for other purposes, you only have a right to object if there are grounds relating to your particular situation.
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      After you exercise your right to object, we will no longer process your personal data for these purposes unless we can demonstrate compelling legitimate grounds for the processing which override your interests, rights and freedoms, or the processing serves the establishment, exercise or defense of legal claims.
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      This does not apply if the processing is for direct marketing purposes. In that case, we will no longer process your personal data for this purpose.
                    </p>
                  </div>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    6.2 Contact options
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    If you have any questions about the collection, processing or use of your personal data, for information, correction, restriction or deletion of data, as well as for the revocation of granted consent or objection to a specific use of data, please contact us directly using the contact details in our{" "}
                    <Link to="/impressum" className="text-blue-600 hover:underline">
                      legal notice
                    </Link>
                    {" "}or through our{" "}
                    <Link to="/contact" className="text-blue-600 hover:underline">
                      contact page
                    </Link>
                    .
                  </p>
                </div>
              </section>
            </div>

            {/* Back to Home Link */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link
                to="/"
                className="text-blue-600 hover:underline font-medium"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Privacy;
