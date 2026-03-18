import React from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.jpeg";
import { useLanguage } from "../context/LanguageContext";

const Terms = () => {
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
                {isDE ? "Allgemeine Geschäftsbedingungen (AGB)" : "General Terms and Conditions of Business"}
              </h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="py-8 sm:py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8 md:p-12">
            <div className="prose prose-lg max-w-none">
              {isDE ? (
                <>
                  {/* 1. Geltungsbereich */}
                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      1. Geltungsbereich
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Die nachstehenden Bedingungen gelten für alle Bestellungen, die über unseren Online‑Shop durch Verbraucher und Unternehmer erfolgen.
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Verbraucher ist jede natürliche Person, die ein Rechtsgeschäft zu Zwecken abschließt, die überwiegend weder ihrer gewerblichen noch ihrer selbständigen beruflichen Tätigkeit zugerechnet werden können. Unternehmer ist eine natürliche oder juristische Person oder eine rechtsfähige Personengesellschaft, die bei Abschluss eines Rechtsgeschäfts in Ausübung ihrer gewerblichen oder selbständigen beruflichen Tätigkeit handelt.
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Für Unternehmer gilt: Abweichende AGB des Unternehmers werden nicht Vertragsbestandteil, es sei denn, wir stimmen ihrer Geltung ausdrücklich zu.
                    </p>
                  </section>

                  {/* 2. Vertragspartner, Vertragsschluss, Korrekturmöglichkeiten */}
                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      2. Vertragspartner, Vertragsschluss, Korrekturmöglichkeiten
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Der Kaufvertrag kommt zustande mit <strong>F&s Smartphones Retail</strong>.
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Mit der Einstellung der Produkte in den Online‑Shop geben wir ein verbindliches Angebot zum Vertragsschluss ab. Sie können Produkte zunächst unverbindlich in den Warenkorb legen und Ihre Eingaben vor Absenden der Bestellung jederzeit korrigieren. Der Vertrag kommt zustande, indem Sie durch Anklicken des Bestellbuttons das Angebot annehmen. Sie erhalten unmittelbar danach eine Bestellbestätigung per E‑Mail.
                    </p>
                  </section>

                  {/* 3. Vertragssprache, Vertragstextspeicherung */}
                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      3. Vertragssprache, Vertragstextspeicherung
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Verfügbare Vertragssprache(n): <strong>Deutsch, Englisch</strong>
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Wir speichern den Vertragstext und senden Ihnen die Bestelldaten sowie unsere AGB in Textform zu. Aus Sicherheitsgründen ist der Vertragstext online nicht mehr zugänglich.
                    </p>
                  </section>

                  {/* 4. Lieferbedingungen */}
                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      4. Lieferbedingungen
                    </h2>
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                        4.1 Lieferoptionen
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                        Wir liefern an die im Bestellprozess angegebene Lieferadresse.
                      </p>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                        Alternativ können Sie Ihre Bestellung bei <strong>F&s Smartphones, Q1 5‑6, 68161 Mannheim, Germany</strong> zu den Geschäftszeiten <strong>10:00 bis 20:00</strong> abholen.
                      </p>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                        Wir liefern nicht an Packstationen.
                      </p>
                    </div>
                  </section>

                  {/* 5. Zahlung */}
                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      5. Zahlung
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Folgende Zahlungsmethoden stehen grundsätzlich zur Verfügung.
                    </p>
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                        5.1 Online‑Zahlungsmethoden
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                        In Zusammenarbeit mit <strong>Stripe</strong> bieten wir folgende Zahlungsmethoden an:
                      </p>
                      <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-2 mb-2">
                        <li><strong>Kredit-/Debitkarten:</strong> Visa und Mastercard über Stripes sichere Zahlungsabwicklung.</li>
                        <li><strong>PayPal:</strong> Sofort oder in Raten zahlen (bis zu 24 Monate).</li>
                        <li><strong>Apple Pay:</strong> Für Apple‑Geräte verfügbar.</li>
                        <li><strong>Google Pay:</strong> Für Android‑Geräte verfügbar.</li>
                        <li><strong>Klarna:</strong> „Buy now, pay later“‑Optionen.</li>
                      </ul>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                        <strong>Hinweis:</strong> Online‑Zahlung gilt für Lieferbestellungen. Wir speichern keine vollständigen Kartendaten.
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                        5.2 Abholung
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                        Bei Abholung erfolgt keine Online‑Zahlung. Sie zahlen bei Abholung (Bar oder Karte).
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                        5.3 Zukünftige Zahlungsmethoden
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                        Wir erweitern unsere Zahlungsoptionen fortlaufend. Neue Zahlungsmethoden werden im Checkout angezeigt.
                      </p>
                    </div>
                  </section>

                  {/* 6. Widerrufsrecht */}
                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      6. Widerrufsrecht
                    </h2>
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                        6.1 Rückgabe neuer Geräte
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                        Rückgaben werden nicht akzeptiert, wenn die Originalverpackung geöffnet oder beschädigt wurde.
                      </p>
                    </div>
                    <div className="mb-4">
                      <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                        6.2 Rückgabe gebrauchter Geräte
                      </h3>
                      <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                        Rückgaben sind innerhalb von 30 Tagen möglich, sofern das Gerät im gleichen Zustand wie bei Lieferung zurückgegeben wird.
                      </p>
                    </div>
                  </section>

                  {/* 7–12 (Kurzfassung, inhaltlich entsprechend) */}
                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      7. Eigentumsvorbehalt
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Die Ware bleibt bis zur vollständigen Bezahlung unser Eigentum.
                    </p>
                  </section>

                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      8. Transportschäden
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Bei offensichtlichen Transportschäden bitten wir um zeitnahe Meldung beim Zusteller und Kontaktaufnahme mit uns. Gesetzliche Rechte bleiben unberührt.
                    </p>
                  </section>

                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      9. Gewährleistung und Garantien
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Es gelten die gesetzlichen Gewährleistungsrechte, soweit nicht abweichend geregelt. Hinweise zu ggf. zusätzlichen Garantien finden Sie beim Produkt.
                    </p>
                  </section>

                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      10. Haftung
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Wir haften unbeschränkt bei Vorsatz, grober Fahrlässigkeit sowie bei Verletzung von Leben, Körper oder Gesundheit. Im Übrigen ist die Haftung bei leichter Fahrlässigkeit auf den vorhersehbaren, vertragstypischen Schaden begrenzt.
                    </p>
                  </section>

                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      11. Streitbeilegung
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Die EU‑Kommission stellt eine OS‑Plattform bereit:{" "}
                      <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        https://ec.europa.eu/consumers/odr/
                      </a>
                      . Wir nehmen nicht an Verbraucherschlichtungsverfahren teil.
                    </p>
                  </section>

                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      12. Schlussbestimmungen
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Für Unternehmer gilt deutsches Recht unter Ausschluss des UN‑Kaufrechts.
                    </p>
                  </section>

                  <section className="mb-6 sm:mb-8">
                    <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                      Kontakt
                    </h2>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                      Bei Fragen kontaktieren Sie uns über{" "}
                      <Link to="/contact" className="text-blue-600 hover:underline">Kontakt</Link>
                      {" "}oder{" "}
                      <Link to="/impressum" className="text-blue-600 hover:underline">Impressum</Link>.
                    </p>
                  </section>
                </>
              ) : null}

              {!isDE ? (
                <>
              {/* 1. Scope */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  1. Scope
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  The following terms and conditions apply to all orders placed via our online shop by consumers and businesses.
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  A consumer is any natural person who enters into a legal transaction for purposes that are predominantly neither attributable to their commercial nor their independent professional activity. A business is a natural or legal person or a legally capable partnership that, when entering into a legal transaction, acts in the exercise of its commercial or independent professional activity.
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  The following applies to business customers: If the business customer uses conflicting or supplementary general terms and conditions, their validity is hereby rejected; they will only become part of the contract if we have expressly agreed to them.
                </p>
              </section>

              {/* 2. Contracting parties, conclusion of contract, correction options */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  2. Contracting parties, conclusion of contract, correction options
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  The purchase agreement is concluded with <strong>F&s Smartphones Retail</strong>.
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  By placing products in our online shop, we are making a binding offer to conclude a contract for these products. You can initially place our products in your shopping cart without obligation and correct your entries at any time before submitting your binding order by using the correction tools provided and explained in the ordering process. The contract is concluded when you accept the offer for the products in your shopping cart by clicking the order button. You will receive an order confirmation by email immediately after submitting your order.
                </p>
              </section>

              {/* 3. Contract language, contract text storage */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  3. Contract language, contract text storage
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  The language(s) available for concluding the contract: <strong>German, English</strong>
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  We save the contract text and send you the order details and our terms and conditions in written form. For security reasons, the contract text is no longer accessible online.
                </p>
              </section>

              {/* 4. Delivery conditions */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  4. Delivery conditions
                </h2>
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    4.1 Delivery options
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    We ship the products to the delivery address specified during the ordering process.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    You have the option of collecting your order from <strong>F&s Smartphones, Q1 5-6, 68161 Mannheim, Germany</strong>, during the following business hours: <strong>10:00 to 20:00</strong>.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    We do not deliver to parcel lockers.
                  </p>
                </div>
              </section>

              {/* 5. Payment */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  5. Payment
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  The following payment methods are generally available in our shop.
                </p>

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    5.1 Online Payment Methods
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    In cooperation with the payment service provider <strong>Stripe</strong>, we offer the following payment methods:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-2 mb-2">
                    <li><strong>Credit/Debit Cards:</strong> Visa and Mastercard cards are accepted through Stripe's secure payment gateway.</li>
                    <li><strong>PayPal:</strong> Pay now or in installments with PayPal. Pay later in up to 24 monthly payments.</li>
                    <li><strong>Apple Pay:</strong> Available for customers using Apple devices (iPhone, iPad, Mac).</li>
                    <li><strong>Google Pay:</strong> Available for customers using Android devices.</li>
                    <li><strong>Klarna:</strong> Buy now, pay later options available through Klarna's payment solutions.</li>
                  </ul>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    <strong>Note:</strong> These payment methods are available for home delivery orders. Your payment is securely processed via Stripe's payment gateway. We do not store or have access to your full card details - these are handled directly by Stripe through their secure checkout system.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    5.2 Pickup Orders
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    For orders collected from our outlet locations, no online payment is processed. Payment is made when you collect your order from the selected outlet. You can pay by cash or card at the outlet.
                  </p>
                </div>

                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    5.3 Future Payment Methods
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    We are continuously working to expand our payment options and may introduce additional methods in the future. Any new payment methods will be clearly displayed during checkout, and their respective terms and conditions will apply.
                  </p>
                </div>
              </section>

              {/* 6. Right of withdrawal */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  6. Right of withdrawal
                </h2>
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    6.1 Returns for new devices
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    Please note that returns are not accepted once the original packaging has been opened or damaged.
                  </p>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    6.2 Returns for Used Devices
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    Returns are possible within 30 days, but only if the used mobile phone is returned in the same condition as when delivered. Alterations or damage will void the right of return.
                  </p>
                </div>
              </section>

              {/* 7. Retention of title */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  7. Retention of title
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  The product remains our property until full payment is received.
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  For businesses, the following applies in addition: We retain title to the product until all claims arising from the ongoing business relationship have been settled in full. You may resell the goods subject to retention of title in the ordinary course of business; you hereby assign to us in advance all claims arising from this resale – irrespective of whether the goods subject to retention of title are combined or mixed with other goods – up to the amount of the invoice, and we accept this assignment. You remain authorized to collect the claims; however, we may also collect the claims ourselves if you fail to meet your payment obligations. We will release the securities to which we are entitled at your request to the extent that the realizable value of the securities exceeds the value of the outstanding claims by more than 10%.
                </p>
              </section>

              {/* 8. Transport damage */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  8. Transport damage
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  <strong>For consumers:</strong> If goods are delivered with obvious transport damage, please report such defects to the delivery person as soon as possible and contact us immediately. Failure to report the damage or contact us will not affect your statutory rights and their enforcement, in particular your warranty rights. However, your cooperation helps us to assert our own claims against the carrier or transport insurance company.
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  <strong>For entrepreneurs:</strong> The risk of accidental loss and accidental deterioration passes to you as soon as we have handed the goods over to the forwarding agent, the carrier or any other person or institution designated to carry out the shipment.
                </p>
              </section>

              {/* 9. Warranty and Guarantees */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  9. Warranty and Guarantees
                </h2>
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    9.1 Warranty Law
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    Unless expressly agreed otherwise below, the statutory warranty rights apply.
                  </p>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    The following limitations and reductions of time limits do not apply to claims based on damages caused by us, our legal representatives or agents:
                  </p>
                  <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-2 mb-2">
                    <li>in case of injury to life, body or health</li>
                    <li>in the case of intentional or grossly negligent breach of duty as well as fraudulent intent</li>
                    <li>in the event of a breach of essential contractual obligations, the fulfillment of which is a prerequisite for the proper execution of the contract and on whose compliance the contractual partner may regularly rely (cardinal obligations)</li>
                    <li>within the framework of a guarantee promise, if agreed, or</li>
                    <li>insofar as the scope of application of the Product Liability Act is opened.</li>
                  </ul>
                  <div className="mt-3">
                    <h4 className="text-base font-semibold text-gray-900 mb-2">Restrictions on entrepreneurs</h4>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      With respect to businesses, only our own specifications and the manufacturer's product descriptions incorporated into the contract constitute an agreement regarding the quality of the goods; we assume no liability for public statements made by the manufacturer or other advertising claims. For businesses, the limitation period for claims based on defects in newly manufactured goods is one year from the transfer of risk. The preceding sentence does not apply to goods that, according to their customary use, have been used in a building and have caused its defectiveness. Used goods are sold excluding all warranties.
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      The statutory limitation periods for the right of recourse under Section 445a of the German Civil Code (BGB) remain unaffected.
                    </p>
                    <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                      <strong>Note to merchants:</strong> Merchants are subject to the duty to inspect and give notice of defects as stipulated in Section 377 of the German Commercial Code (HGB). If you fail to give the required notice, the goods are deemed accepted, unless the defect was not discoverable upon inspection. This does not apply if we have fraudulently concealed a defect.
                    </p>
                  </div>
                </div>
                <div className="mb-4">
                  <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">
                    9.2 Guarantees and Customer Service
                  </h3>
                  <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-2">
                    Information on any applicable additional warranties and their exact terms can be found with the product and on special information pages in the online shop.
                  </p>
                </div>
              </section>

              {/* 10. Liability */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  10. Liability
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  We are always liable without limitation for claims arising from damages caused by us, our legal representatives or agents:
                </p>
                <ul className="list-disc pl-5 sm:pl-6 text-sm sm:text-base text-gray-700 space-y-2 mb-3 sm:mb-4">
                  <li>in case of injury to life, body or health,</li>
                  <li>in the case of intentional or grossly negligent breach of duty,</li>
                  <li>in the case of warranty promises, if agreed, or</li>
                  <li>insofar as the scope of application of the Product Liability Act is opened.</li>
                </ul>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  In the event of a breach of essential contractual obligations, the fulfillment of which is a prerequisite for the proper execution of the contract and on which the contractual partner may regularly rely (cardinal obligations), caused by slight negligence on the part of us, our legal representatives, or vicarious agents, our liability is limited to the amount of the foreseeable damage that typically arises at the time of conclusion of the contract.
                </p>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  All other claims for damages are excluded.
                </p>
              </section>

              {/* 11. Dispute Resolution */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  11. Dispute Resolution
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  The European Commission provides a platform for online dispute resolution (ODR), which you can find{" "}
                  <a href="https://ec.europa.eu/consumers/odr/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                    here
                  </a>
                  . We are neither obligated nor willing to participate in dispute resolution proceedings before a consumer arbitration board.
                </p>
              </section>

              {/* 12. Final Provisions */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  12. Final Provisions
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  If you are an entrepreneur, then German law applies, excluding the UN Convention on Contracts for the International Sale of Goods.
                </p>
              </section>

              {/* Contact Information */}
              <section className="mb-6 sm:mb-8">
                <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3 sm:mb-4">
                  Contact Information
                </h2>
                <p className="text-sm sm:text-base text-gray-700 leading-relaxed mb-3 sm:mb-4">
                  If you have any questions about these Terms and Conditions, please contact us through our{" "}
                  <Link to="/contact" className="text-blue-600 hover:underline">
                    contact page
                  </Link>
                  {" "}or{" "}
                  <Link to="/impressum" className="text-blue-600 hover:underline">
                    legal notice
                  </Link>
                  .
                </p>
              </section>
                </>
              ) : null}
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

export default Terms;
