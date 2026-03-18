import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { useLanguage } from "../context/LanguageContext";

const ReturnPolicy = () => {
  const { language } = useLanguage();
  const isDE = language === "de";
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-gray-900 to-black text-white py-12 sm:py-16 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex flex-col items-center justify-center gap-3 sm:gap-4 mb-6">
              <img 
                src={logo} 
                alt="F&s Smartphones" 
                className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 rounded-xl object-cover shadow-lg shrink-0"
              />
              <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight text-center">
                {isDE ? "Widerrufsbelehrung" : "Return Policy"}
              </h1>
            </div>
            <p className="text-base sm:text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mt-4 sm:mt-6 px-4">
              {isDE ? "Recht auf Widerruf" : "Right of Withdrawal"}
            </p>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
            <div className="prose prose-lg max-w-none">

              {/* 1. Right of Withdrawal */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {isDE ? "1. Widerrufsrecht" : "1. Right of Withdrawal"}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                  {isDE ? (
                    <>
                      Sie haben das Recht, binnen <strong>30 Tagen</strong> ohne Angabe von Gründen diesen Vertrag zu widerrufen.
                    </>
                  ) : (
                    <>
                      You have the right to withdraw from this contract within <strong>30 days</strong> without giving any reason.
                    </>
                  )}
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                  {isDE
                    ? "Die Widerrufsfrist beträgt 30 Tage ab dem Tag, an dem Sie oder ein von Ihnen benannter Dritter (der nicht Beförderer ist) die Waren in Besitz genommen haben."
                    : "The withdrawal period will expire after 30 days from the day on which you acquire, or a third party other than the carrier and indicated by you acquires, physical possession of the goods."}
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {isDE
                    ? "Um Ihr Widerrufsrecht auszuüben, müssen Sie uns mittels einer eindeutigen Erklärung (z. B. per E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren. Zur Wahrung der Widerrufsfrist reicht es aus, dass Sie die Mitteilung über die Ausübung des Widerrufsrechts vor Ablauf der Widerrufsfrist absenden."
                    : "To exercise the right of withdrawal, you must inform us of your decision to withdraw from this contract by an unequivocal statement (e.g. a letter sent by post or email). To meet the withdrawal deadline, it is sufficient for you to send your communication before the withdrawal period has expired."}
                </p>
              </section>

              {/* 2. Refund */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {isDE ? "2. Rückerstattung" : "2. Refund"}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                  {isDE ? (
                    <>
                      Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, einschließlich der Lieferkosten, unverzüglich und spätestens binnen <strong>14 Tagen</strong> ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf bei uns eingegangen ist.
                    </>
                  ) : (
                    <>
                      If you withdraw from this contract, we shall reimburse to you all payments received from you, including the costs of delivery, without undue delay and in any event not later than <strong>14 days</strong> from the day on which we are informed about your decision to withdraw.
                    </>
                  )}
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {isDE
                    ? "Für diese Rückzahlung verwenden wir dasselbe Zahlungsmittel, das Sie bei der ursprünglichen Transaktion eingesetzt haben. Wir können die Rückzahlung verweigern, bis wir die Waren wieder zurückerhalten haben."
                    : "We will carry out such reimbursement using the same means of payment as you used for the initial transaction. We may withhold reimbursement until we have received the goods back."}
                </p>
              </section>

              {/* 3. Return of Goods */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {isDE ? "3. Rücksendung der Waren" : "3. Return of Goods"}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                  {isDE ? (
                    <>
                      Sie haben die Waren unverzüglich und in jedem Fall spätestens binnen <strong>14 Tagen</strong> ab dem Tag, an dem Sie uns über den Widerruf unterrichten, an uns zurückzusenden. <strong>Wir tragen die Kosten der Rücksendung.</strong> Sie erhalten ein kostenloses Rücksendeetikett per E-Mail.
                    </>
                  ) : (
                    <>
                      You shall send back the goods without undue delay and in any event not later than <strong>14 days</strong> from the day on which you communicate your withdrawal. <strong>We will bear the cost of returning the goods.</strong> You will receive a free return shipping label from us by email.
                    </>
                  )}
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3">
                  {isDE ? "Bitte senden Sie die Ware an:" : "Please send the goods to:"}
                </p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                    <strong>F&s Smartphones</strong><br />
                    Q1 5-6<br />
                    68161 Mannheim<br />
                    Germany
                  </p>
                </div>
              </section>

              {/* 4. Contact */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  {isDE ? "4. Kontakt" : "4. Contact"}
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed">
                  {isDE ? "Wenn Sie Fragen zu unserer Widerrufsbelehrung haben, kontaktieren Sie uns:" : "If you have any questions about our return policy, please contact us:"}
                  <br /><br />
                  <strong>{isDE ? "E-Mail" : "Email"}:</strong>{" "}
                  <a href="mailto:F-und-ssmartphones@web.de" className="text-blue-600 hover:underline">
                    F-und-ssmartphones@web.de
                  </a><br />
                  <strong>{isDE ? "Telefon" : "Phone"}:</strong>{" "}
                  <a href="tel:+4917680312302" className="text-blue-600 hover:underline">
                    017680312302
                  </a>
                </p>
              </section>
            </div>

            {/* Back to Home Link */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link
                to="/"
                className="text-blue-600 hover:underline font-medium"
              >
                {isDE ? "← Zurück zur Startseite" : "← Back to Home"}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
