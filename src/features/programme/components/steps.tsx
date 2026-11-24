import { cn } from "@/lib/utils/cn";
import { PROGRAMME_OPTIONS, getProgrammeOption } from "../data";
import {
  asStr,
  isNismCertifiedForOnField,
  normalizeAadhaarLast4Input,
  normalizeMobile10Input,
  normalizePanInput,
  persistSelectedProgramme,
  type CheckSetter,
  type ChipPicker,
  type ErrorsState,
  type FieldSetter,
  type FileAdder,
  type FileRemover,
  type FormState,
  type UploadsState,
} from "../validation";
import {
  AnnexureBlock,
  Checkbox,
  Chips,
  Field,
  Select,
  SignatureField,
  SubHeading,
  TextArea,
  Upload,
} from "./fields";

/** Two and three fields side by side from the small breakpoint up. */
const TWO = "grid gap-x-4 sm:grid-cols-2";
const THREE = "grid gap-x-4 sm:grid-cols-3";

/**
 * The application's seven steps, in order. Field names are the API's keys and chip options are
 * stored values: change labels freely, never names or option strings.
 */
export function getSteps(
  form: FormState,
  set: FieldSetter,
  pick: ChipPicker,
  uploads: UploadsState,
  addFile: FileAdder,
  rmFile: FileRemover,
  chk: CheckSetter,
  errors: ErrorsState = {},
) {
  const err = (name: string) => !!errors[name];
  return [
    {
      title: "Personal details", sub: "Section A: Basic information and contact details", short: "Personal",
      render: () => (
        <>
          <SubHeading>Basic information</SubHeading>
          <Field label="Full name (as per PAN / Aadhaar)" name="fullName" placeholder="Your full legal name" value={form.fullName} onChange={set} required error={err("fullName")} />
          <div className={TWO}>
            <Chips label="Gender" name="gender" options={["Male", "Female", "Other", "Prefer not to say"]} value={form.gender} onPick={pick} required error={err("gender")} />
            <Field label="Date of birth" name="dob" type="date" value={form.dob} onChange={set} required error={err("dob")} />
          </div>
          <Field
            label="WhatsApp number"
            name="whatsapp"
            type="tel"
            placeholder="10-digit mobile number"
            value={form.whatsapp}
            onChange={set}
            required
            error={err("whatsapp")}
            maxLength={10}
            inputMode="numeric"
            transform={normalizeMobile10Input}
          />
          <Field label="Email address" name="email" type="email" placeholder="you@example.com" value={form.email} onChange={set} required error={err("email")} />
          <div className={TWO}>
            <Field
              label="PAN"
              name="pan"
              placeholder="ABCDE1234F"
              value={form.pan}
              onChange={set}
              required
              error={err("pan")}
              maxLength={10}
              inputMode="text"
              transform={normalizePanInput}
            />
            <Field
              label="Aadhaar number (last 4 digits only)"
              name="aadhaar"
              placeholder="1234"
              value={form.aadhaar}
              onChange={set}
              required
              error={err("aadhaar")}
              maxLength={4}
              inputMode="numeric"
              transform={normalizeAadhaarLast4Input}
            />
          </div>
          <Chips label="Marital status" name="maritalStatus" options={["Single", "Married", "Other"]} value={form.maritalStatus} onPick={pick} required error={err("maritalStatus")} />
          <Field label="Father's, mother's or guardian's name" name="guardian" value={form.guardian} onChange={set} required error={err("guardian")} />
          <div className={TWO}>
            <Field label="Emergency contact person" name="emergencyContact" value={form.emergencyContact} onChange={set} required error={err("emergencyContact")} />
            <Field label="Relationship" name="emergencyRelation" value={form.emergencyRelation} onChange={set} required error={err("emergencyRelation")} />
          </div>
          <div className={TWO}>
            <Field
              label="Emergency contact number"
              name="emergencyPhone"
              type="tel"
              placeholder="10-digit mobile number"
              value={form.emergencyPhone}
              onChange={set}
              required
              error={err("emergencyPhone")}
              maxLength={10}
              inputMode="numeric"
              transform={normalizeMobile10Input}
            />
            <Field label="Blood group (optional)" name="bloodGroup" value={form.bloodGroup} onChange={set} />
          </div>
          <Chips label="Medical condition relevant to travel or field activity?" name="medicalCondition" options={["No", "Yes"]} value={form.medicalCondition} onPick={pick} required error={err("medicalCondition")} />
          {form.medicalCondition === "Yes" && <Field label="Please specify" name="medicalDetails" value={form.medicalDetails} onChange={set} required error={err("medicalDetails")} />}

          <SubHeading>Permanent address</SubHeading>
          <div className={TWO}>
            <Field label="House or flat number" name="permHouse" value={form.permHouse} onChange={set} required error={err("permHouse")} />
            <Field label="Street or area" name="permStreet" value={form.permStreet} onChange={set} required error={err("permStreet")} />
          </div>
          <div className={THREE}>
            <Field label="City" name="permCity" value={form.permCity} onChange={set} required error={err("permCity")} />
            <Field label="District" name="permDistrict" value={form.permDistrict} onChange={set} required error={err("permDistrict")} />
            <Field label="State" name="permState" value={form.permState} onChange={set} required error={err("permState")} />
          </div>
          <Field label="PIN code" name="permPin" value={form.permPin} onChange={set} required error={err("permPin")} />

          <SubHeading>Current residential address</SubHeading>
          <Checkbox name="sameAddress" label="Same as permanent address" checked={form.sameAddress} onCheck={chk} />
          {!form.sameAddress && (
            <>
              <div className={TWO}>
                <Field label="House or flat number" name="currHouse" value={form.currHouse} onChange={set} required error={err("currHouse")} />
                <Field label="Street or area" name="currStreet" value={form.currStreet} onChange={set} required error={err("currStreet")} />
              </div>
              <div className={THREE}>
                <Field label="City" name="currCity" value={form.currCity} onChange={set} required error={err("currCity")} />
                <Field label="District" name="currDistrict" value={form.currDistrict} onChange={set} required error={err("currDistrict")} />
                <Field label="State" name="currState" value={form.currState} onChange={set} required error={err("currState")} />
              </div>
              <Field label="PIN code" name="currPin" value={form.currPin} onChange={set} required error={err("currPin")} />
            </>
          )}
        </>
      ),
    },
    {
      title: "NISM certification", sub: "Section B: Certification status and examination details", short: "NISM",
      render: () => (
        <>
          <SubHeading>Existing NISM qualifications</SubHeading>
          <Chips label="NISM Series X-A: Investment Adviser (Level 1)" name="nismXA" options={["Passed", "Appeared", "Not Attempted"]} value={form.nismXA} onPick={pick} required error={err("nismXA")} />
          {form.nismXA === "Passed" && (
            <div className={THREE}>
              <Field label="Certificate number" name="nismXA_cert" value={form.nismXA_cert} onChange={set} required error={err("nismXA_cert")} />
              <Field label="Date of passing" name="nismXA_date" type="date" value={form.nismXA_date} onChange={set} required error={err("nismXA_date")} />
              <Field label="Valid till" name="nismXA_valid" type="date" value={form.nismXA_valid} onChange={set} required error={err("nismXA_valid")} />
            </div>
          )}
          <Chips label="NISM Series X-B: Investment Adviser (Level 2)" name="nismXB" options={["Passed", "Appeared", "Not Attempted"]} value={form.nismXB} onPick={pick} required error={err("nismXB")} />
          {form.nismXB === "Passed" && (
            <div className={THREE}>
              <Field label="Certificate number" name="nismXB_cert" value={form.nismXB_cert} onChange={set} required error={err("nismXB_cert")} />
              <Field label="Date of passing" name="nismXB_date" type="date" value={form.nismXB_date} onChange={set} required error={err("nismXB_date")} />
              <Field label="Valid till" name="nismXB_valid" type="date" value={form.nismXB_valid} onChange={set} required error={err("nismXB_valid")} />
            </div>
          )}
          <Field label="Any other NISM certification" name="nismOther" placeholder="e.g. NISM Mutual Fund Distributors" value={form.nismOther} onChange={set} />
          <SubHeading>Examination details</SubHeading>
          <Chips label="Registered for NISM Series X-A?" name="registeredXA" options={["Yes", "No"]} value={form.registeredXA} onPick={pick} required error={err("registeredXA")} />
          <Chips label="Registered for NISM Series X-B?" name="registeredXB" options={["Yes", "No"]} value={form.registeredXB} onPick={pick} required error={err("registeredXB")} />
          <Chips label="Previously appeared for either exam?" name="previouslyAppeared" options={["Yes", "No"]} value={form.previouslyAppeared} onPick={pick} required error={err("previouslyAppeared")} />
          {form.previouslyAppeared === "Yes" && <Field label="Attempt details and result" name="attemptDetails" value={form.attemptDetails} onChange={set} required error={err("attemptDetails")} />}
          <Chips label="Need guidance for NISM exam registration?" name="needGuidance" options={["Yes", "No"]} value={form.needGuidance} onPick={pick} required error={err("needGuidance")} />
        </>
      ),
    },
    {
      title: "Professional details", sub: "Section D: Work experience, location, and mobility", short: "Professional",
      render: () => (
        <>
          <SubHeading>Professional background</SubHeading>
          <Chips label="Current professional status" name="professionalStatus" options={["Student", "Fresher", "Salaried Professional", "Self-Employed", "Business Owner", "Career Switcher", "Other"]} value={form.professionalStatus} onPick={pick} required error={err("professionalStatus")} />
          <div className={TWO}>
            <Field label="Current organisation or college" name="currentOrg" value={form.currentOrg} onChange={set} required error={err("currentOrg")} />
            <Field label="Designation or course name" name="designation" value={form.designation} onChange={set} required error={err("designation")} />
          </div>
          <div className={TWO}>
            <Field label="Total work experience" name="workExperience" placeholder="e.g. 2 years" value={form.workExperience} onChange={set} required error={err("workExperience")} />
            <Field label="Current industry or sector" name="industry" value={form.industry} onChange={set} required error={err("industry")} />
          </div>
          <div className={TWO}>
            <Field label="Income range (optional)" name="incomeRange" value={form.incomeRange} onChange={set} />
            <Field label="Notice period, if employed" name="noticePeriod" value={form.noticePeriod} onChange={set} />
          </div>
          <Chips label="Current work mode" name="workMode" options={["Full-Time", "Part-Time", "Freelance", "Self-Employed"]} value={form.workMode} onPick={pick} required error={err("workMode")} />
          <Chips label="Able to participate in field-based activities?" name="fieldActivities" options={["Yes", "No"]} value={form.fieldActivities} onPick={pick} required error={err("fieldActivities")} />
          <TextArea label="Reason for joining this programme" name="reasonJoining" placeholder="What motivated you to apply?" value={form.reasonJoining} onChange={set} required error={err("reasonJoining")} />
          <SubHeading>Location and mobility</SubHeading>
          <div className={TWO}>
            <Field label="Current city" name="currentCity" value={form.currentCity} onChange={set} required error={err("currentCity")} />
            <Field label="Current state" name="currentState" value={form.currentState} onChange={set} required error={err("currentState")} />
          </div>
          <Chips label="Willing to travel to Mumbai for on-field training?" name="willingToTravel" options={["Yes", "No"]} value={form.willingToTravel} onPick={pick} required error={err("willingToTravel")} />
          <Chips label="Need support planning travel or accommodation?" name="needTravelSupport" options={["Yes", "No"]} value={form.needTravelSupport} onPick={pick} required error={err("needTravelSupport")} />
          <Chips label="Willing to undertake client-facing activities?" name="clientFacing" options={["Yes", "No"]} value={form.clientFacing} onPick={pick} required error={err("clientFacing")} />
          <Chips label="Preferred language for client interaction" name="preferredLang" options={["English", "Hindi", "Marathi", "Other"]} value={form.preferredLang} onPick={pick} required error={err("preferredLang")} />
        </>
      ),
    },
    {
      title: "Programme motivation", sub: "Section E: Your goals and expectations", short: "Motivation",
      render: () => (
        <>
          <TextArea label="1. Why do you want to build a career in investment advisory or financial planning?" name="motivation" placeholder="Share what draws you to this field..." value={form.motivation} onChange={set} />
          <TextArea label="2. What do you expect to achieve through this programme?" name="expectations" placeholder="Your learning goals and career expectations..." value={form.expectations} onChange={set} />
          <Chips label="3. Comfortable interacting with clients, conducting meetings, explaining financial-planning services?" name="comfortLevel" options={["Yes", "No", "I would require training and guidance"]} value={form.comfortLevel} onPick={pick} />
          <Select label="4. What are your long-term career plans?" name="longTermGoal" options={["Work in financial advisory", "Build an advisory practice", "Improve financial knowledge", "Career transition into finance", "Other"]} value={form.longTermGoal} onChange={set} />
        </>
      ),
    },
    {
      title: "Document upload", sub: "Section F: Upload supporting documents", short: "Documents",
      render: () => (
        <>
          <p className="mb-6 text-sm text-grey-500">Fields marked with * are required. Other documents can be skipped if not applicable.</p>
          <Upload label="Recent passport-size photograph" name="photo" files={uploads.photo} onAdd={addFile} onRemove={rmFile} required error={err("photo")} />
          <Upload label="PAN card copy" name="panCard" files={uploads.panCard} onAdd={addFile} onRemove={rmFile} required error={err("panCard")} />
          <Upload label="Aadhaar card or valid address proof" name="aadhaarCard" files={uploads.aadhaarCard} onAdd={addFile} onRemove={rmFile} required error={err("aadhaarCard")} />
          <Upload label="Graduation mark sheet or degree certificate" name="gradCert" files={uploads.gradCert} onAdd={addFile} onRemove={rmFile} required error={err("gradCert")} />
          <Upload label="NISM certificate(s), if applicable" name="nismCertDoc" files={uploads.nismCertDoc} onAdd={addFile} onRemove={rmFile} />
          <Upload label="NISM scorecard(s), if applicable" name="nismScorecard" files={uploads.nismScorecard} onAdd={addFile} onRemove={rmFile} />
          <Upload label="Updated resume or CV" name="resumeDoc" files={uploads.resumeDoc} onAdd={addFile} onRemove={rmFile} />
        </>
      ),
    },
    {
      title: "Declarations and undertakings", sub: "Section G: Read, agree, and e-sign all undertakings", short: "Declarations",
      render: () => (
        <>
          <AnnexureBlock title="Candidate Declaration" body={<p>I declare that all information provided is true, accurate, and complete to the best of my knowledge. I understand that:</p>}
            items={["Any incorrect or misleading information may lead to rejection or cancellation.", "Admission is subject to Fydaa's review and approval.", "I am responsible for submitting valid supporting documents.", "I will maintain professional conduct throughout the programme.", "NISM outcomes are subject to the applicable NISM process.", "I will not misrepresent myself as a registered adviser or Fydaa representative."]} />

          <AnnexureBlock title="Annexure 1: Mumbai On-Field Training Consent" body={<p>I confirm that I understand the programme includes practical on-field training in Mumbai during the third month. I voluntarily consent to:</p>}
            items={["Attend the complete offline/on-field training in Mumbai as scheduled.", "Participate in client interaction, field observation, CRM usage, meeting documentation, and business-development activities.", "Follow instructions provided by programme trainers and Fydaa representatives.", "Arrange and bear responsibility for my travel, stay, meals, and personal expenses unless otherwise communicated.", "Inform the team in advance of any constraint affecting my participation."]} />

          <AnnexureBlock title="Annexure 2: Month 4 Live Implementation Commitment" body={<p>I understand that Month 4 is for implementing skills in live settings. I agree to:</p>}
            items={["Participate sincerely in the implementation and evaluation phase.", "Apply programme learning in a professional, ethical, and responsible manner.", "Complete assigned activities, documentation, CRM updates, and reporting on time.", "Attend review meetings, mentorship sessions, and performance discussions.", "Maintain honesty in reporting meetings, interactions, and activity status.", "Respect privacy and confidentiality of all clients, prospects, and programme information.", "Understand evaluation is based on participation, quality, documentation, and consistency."]} />

          <AnnexureBlock title="Annexure 3: Code of Conduct & Confidentiality" body={<p>I agree to maintain professional conduct and undertake that I will:</p>}
            items={["Treat clients, prospects, trainers, staff, and fellow participants respectfully.", "Not make false promises, return guarantees, or unauthorised financial claims.", "Not share confidential information with unauthorised persons.", "Use programme resources only for legitimate learning and authorised activities.", "Not misuse the Fydaa name, logo, client data, or programme material.", "Follow all instructions relating to ethical conduct and advisory practices.", "Not record, circulate, or distribute training content without written permission."]} />

          <AnnexureBlock title="Annexure 4: Parent / Guardian Consent" body={<p>I confirm awareness of the candidate's application to the Fydaa Investment Adviser Programme. I understand the programme includes classroom learning, NISM certification prep, Mumbai on-field training, and client-facing learning. I give my consent for participation.</p>} items={[]} />
          <div className="mb-4 rounded-card border border-line p-5 sm:p-6">
            <h3 className="mb-4 text-base font-semibold text-ink [font-stretch:104%]">Parent or guardian details (if applicable)</h3>
            <div className={TWO}>
              <Field label="Parent or guardian name" name="parentName" value={form.parentName} onChange={set} />
              <Field label="Relationship" name="parentRelation" value={form.parentRelation} onChange={set} />
            </div>
            <Field label="Parent or guardian mobile number" name="parentMobile" type="tel" value={form.parentMobile} onChange={set} />
          </div>

          <AnnexureBlock title="Annexure 5: Employer No-Objection Certificate" body={<p>This certifies the employee has informed their employer of participation. The employer has no objection, subject to operational requirements. This NOC does not create any obligation on the employer to bear programme costs.</p>} items={[]} />
          <div className="mb-4 rounded-card border border-line p-5 sm:p-6">
            <h3 className="mb-4 text-base font-semibold text-ink [font-stretch:104%]">Employer details (if applicable)</h3>
            <div className={TWO}>
              <Field label="Authorised signatory name" name="empSignatory" value={form.empSignatory} onChange={set} />
              <Field label="Designation" name="empDesignation" value={form.empDesignation} onChange={set} />
            </div>
            <Field label="Organisation name" name="empOrg" value={form.empOrg} onChange={set} />
          </div>

          {/* Combined agreement + e-sign */}
          <div className="mt-8 rounded-card border border-line p-5 sm:p-6">
            <h3 className="mb-4 text-base font-semibold text-ink [font-stretch:104%]">Agreement and electronic signature</h3>
            <label
              className={cn(
                "mb-4 flex min-h-11 cursor-pointer items-start gap-3 rounded-btn border bg-jade-tint p-3.5",
                err("allAnnex_agree") ? "border-danger" : "border-jade/20",
              )}
            >
              <input
                type="checkbox"
                checked={!!form.allAnnex_agree}
                onChange={(e) => chk("allAnnex_agree", e.target.checked)}
                aria-invalid={err("allAnnex_agree") || undefined}
                className="mt-0.5 size-5 shrink-0 cursor-pointer accent-jade"
              />
              <span className="text-sm font-semibold leading-relaxed text-jade">I have read and agree to the Candidate Declaration and all Annexures (1 through 5) above</span>
            </label>
            {err("allAnnex_agree") && <p role="alert" className="mb-3 text-sm text-danger">Please agree to the declarations to continue.</p>}
            <p className="mb-5 text-sm text-grey-500">By signing below, you confirm your agreement to all the declarations and undertakings listed on this page.</p>
            <div className={TWO}>
              <Field label="Full name" name="esign_name" value={form.esign_name} onChange={set} required error={err("esign_name")} />
              <Field label="Date" name="esign_date" type="date" value={form.esign_date} onChange={set} required error={err("esign_date")} />
            </div>
            <div className={TWO}>
              <Field label="Place" name="esign_place" value={form.esign_place} onChange={set} required error={err("esign_place")} />
              <SignatureField name="esign_sig" value={form.esign_sig} onChange={set} error={err("esign_sig")} />
            </div>
          </div>
        </>
      ),
    },
    {
      title: "Choose your programme",
      sub: "Select your programme and proceed to payment",
      short: "Programme",
      render: () => {
        const selected = asStr(form.selectedProgramme);
        const selectedOption = getProgrammeOption(selected);
        const onfieldBlocked =
          selected === "onfield" && !isNismCertifiedForOnField(form, uploads);

        return (
          <>
            <p className="mb-6 text-base leading-relaxed text-grey-600">
              Choose the programme that fits your current stage. You can proceed to payment after selecting.
            </p>
            <div role="group" aria-label="Programme" className="mb-4 grid gap-4 sm:grid-cols-2">
              {PROGRAMME_OPTIONS.map((option) => {
                const isSelected = selected === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => {
                      pick("selectedProgramme", option.id);
                      persistSelectedProgramme(option.id);
                    }}
                    className={cn(
                      "flex flex-col rounded-card border p-5 text-left transition-colors duration-quick",
                      "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-jade",
                      isSelected
                        ? "border-jade bg-jade-tint"
                        : err("selectedProgramme")
                          ? "border-danger bg-white hover:border-grey-300"
                          : "border-line bg-white hover:border-grey-300",
                    )}
                  >
                    <span className="mb-3 flex w-full items-start justify-between gap-3">
                      <span
                        className={cn(
                          "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                          option.badgeTone === "jade" ? "bg-jade text-white" : "bg-mist text-grey-600",
                        )}
                      >
                        {option.badge}
                      </span>
                      <span
                        className={cn(
                          "mt-0.5 flex size-5 shrink-0 items-center justify-center rounded-full border-2",
                          isSelected ? "border-jade bg-jade" : "border-grey-300 bg-white",
                        )}
                        aria-hidden="true"
                      >
                        {isSelected && <span className="size-2 rounded-full bg-white" />}
                      </span>
                    </span>
                    <span className="text-title text-ink">{option.title}</span>
                    <span className="mb-4 mt-2 text-sm leading-relaxed text-grey-600">{option.description}</span>
                    <span className="mt-auto flex flex-wrap items-baseline gap-x-2">
                      <span className="figure text-3xl font-semibold text-ink">{option.feeLabel}</span>
                      <span className="text-sm text-grey-500">+ taxes</span>
                    </span>
                    <span className="mt-1 text-xs text-grey-500">One-time fee</span>
                  </button>
                );
              })}
            </div>

            {selectedOption && (
              <div role="status" className="mb-3 flex items-start gap-3 rounded-card border border-jade/20 bg-jade-tint px-4 py-3">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="mt-0.5 shrink-0">
                  <circle cx="12" cy="12" r="10" className="fill-jade" />
                  <path d="M8 12.5l2.5 2.5L16 9.5" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <p className="text-sm font-semibold leading-snug text-jade">
                  {selectedOption.selectionLabel} selected. Fee: {selectedOption.feeLabel} + applicable taxes.
                </p>
              </div>
            )}

            {(onfieldBlocked || err("selectedProgramme")) && selected === "onfield" && (
              <p role="alert" className="mt-1 text-sm text-danger">
                This programme is only for NISM certified candidates
              </p>
            )}
            {err("selectedProgramme") && !selected && (
              <p role="alert" className="mt-1 text-sm text-danger">Please select a programme to continue.</p>
            )}
          </>
        );
      },
    },
  ];
}
