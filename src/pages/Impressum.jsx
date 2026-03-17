import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";

const Impressum = () => {
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
                Impressum
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-4 sm:mt-6 px-4">
              Information according to § 5 DDG
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {/* Verantwortlicher */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Verantwortlicher
                </h2>
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-1">
                  <p>Fahad Shah Lalpurwal</p>
                  <p>Q1 5-6</p>
                  <p>68161 Mannheim</p>
                  <p>Germany</p>
                </div>
              </section>

              {/* Lieferadresse */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Lieferadresse
                </h2>
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-1">
                  <p>F&s Smartphones</p>
                  <p>Q1 5-6</p>
                  <p>68161 Mannheim</p>
                </div>
              </section>

              {/* Registration & Tax Numbers */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Steuer- & Registrierungsnummern
                </h2>
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-2">
                  <p>
                    <strong>Steuernummer:</strong> 38289/00431
                  </p>
                  <p>
                    <strong>Umsatzsteuer ID Nr.:</strong> DE454837631
                  </p>
                  <p>
                    <strong>Registrierungsnummer Lucid:</strong> DE3319821243613
                  </p>
                  <p>
                    <strong>Händel Registernummer:</strong> HRA 713079
                  </p>
                  <p>
                    <strong>IBAN:</strong> IE96SUMU99036511821646
                  </p>
                </div>
              </section>

              {/* Contact Information */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Kontakt
                </h2>
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-2">
                  <p>
                    <strong>Paypal-Konto:</strong>{" "}
                    <a
                      href="mailto:F-und-ssmartphones@web.de"
                      className="text-blue-600 hover:underline"
                    >
                      F-und-ssmartphones@web.de
                    </a>
                  </p>
                  <p>
                    <strong>Web:</strong>{" "}
                    <a
                      href="https://Fundssmartphones.de"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      https://Fundssmartphones.de
                    </a>
                  </p>
                  <p>
                    <strong>Email:</strong>{" "}
                    <a
                      href="mailto:F-und-ssmartphones@web.de"
                      className="text-blue-600 hover:underline"
                    >
                      F-und-ssmartphones@web.de
                    </a>
                  </p>
                  <p>
                    <strong>Telefon:</strong>{" "}
                    <a
                      href="tel:+4917680312302"
                      className="text-blue-600 hover:underline"
                    >
                      017680312302
                    </a>
                  </p>
                </div>
              </section>

              {/* EU Dispute Resolution */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Online-Streitbeilegung
                </h2>
                <div className="text-sm sm:text-base text-gray-700 leading-relaxed space-y-3">
                  <p>
                    Plattform der EU-Kommission zur Online-Streitbeilegung:{" "}
                    <a
                      href="https://ec.europa.eu/consumers/odr/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline break-all"
                    >
                      https://ec.europa.eu/consumers/odr/
                    </a>
                  </p>
                  <p>
                    Hinweis nach § 36 VSBG: Wir nehmen nicht an einem Streitbeilegungsverfahren von einer Verbraucherschlichtungsstelle teil.
                  </p>
                </div>
              </section>

              {/* Pricing Note */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Preishinweis
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  Der im Angebot ausgewiesene Preis ist ein Endpreis. Es erfolgt eine Differenzbesteuerung nach § 25 a UStG.
                </p>
              </section>

              {/* Privacy Policy Link */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Privacy Policy
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  You can find our privacy policy at the following{" "}
                  <Link to="/privacy" className="text-blue-600 hover:underline">
                    link
                  </Link>
                  .
                </p>
              </section>

              {/* Liability Disclaimer */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Disclaimer:
                </h2>

                {/* Liability for Content */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    Liability for Content
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    The content of our website has been created with the utmost care. However, we cannot guarantee the accuracy, completeness, or timeliness of the content. As a service provider, we are responsible for our own content on these pages in accordance with Section 7 Paragraph 1 of the German Telemedia Act (TMG). However, according to Sections 8 to 10 of the TMG, we are not obligated as a service provider to monitor transmitted or stored third-party information or to investigate circumstances that indicate illegal activity. Obligations to remove or block the use of information in accordance with general laws remain unaffected. However, liability in this respect is only possible from the point at which we become aware of a specific legal violation. Upon becoming aware of such legal violations, we will remove this content immediately.
                  </p>
                </div>

                {/* Liability for Links */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    Liability for Links
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    Our website contains links to external websites of third parties, over whose content we have no influence. Therefore, we cannot assume any liability for this third-party content. The respective provider or operator of the linked pages is always responsible for their content. The linked pages were checked for possible legal violations at the time the links were created. Illegal content was not apparent at the time the links were created. However, continuous monitoring of the content of linked pages is not reasonable without concrete evidence of a legal violation. Upon notification of legal violations, we will remove such links immediately.
                  </p>
                </div>

                {/* Copyright */}
                <div className="mb-4 sm:mb-6">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    Copyright
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    The content and works created by the website operators on these pages are subject to German copyright law. Reproduction, processing, distribution, and any form of exploitation beyond the limits of copyright law require the written consent of the respective author or creator. Downloads and copies of this page are permitted only for private, non-commercial use. Insofar as the content on this page was not created by the operator, the copyrights of third parties are respected. In particular, third-party content is identified as such. Should you nevertheless become aware of a copyright infringement, please notify us accordingly. Upon notification of legal violations, we will remove such content immediately.
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

export default Impressum;
