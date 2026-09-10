import { useEffect, useMemo, useRef, useState } from 'react';
import {
  projectTypes,
  platforms,
  stackGroups,
  featureOptions,
  designNeeds,
  timelines,
  budgets,
  engagements,
  referrals
} from '../data/stacks.js';
import { submitBrief } from '../lib/api.js';
import { SectionHead } from './Reveal.jsx';

const DRAFT_KEY = 'neuralwebworks.brief.draft';

const EMPTY = {
  projectType: '',
  platforms: [],
  stack: [],
  features: [],
  design: [],
  timeline: '',
  budget: '',
  engagement: '',
  name: '',
  email: '',
  company: '',
  phone: '',
  country: '',
  referral: '',
  summary: '',
  nda: false,
  website: '' // honeypot, must stay empty
};

const STEPS = [
  { id: 'scope', label: 'Scope', hint: 'What are we building?' },
  { id: 'stack', label: 'Stack', hint: 'Technology preferences' },
  { id: 'features', label: 'Features', hint: 'What it needs to do' },
  { id: 'shape', label: 'Shape', hint: 'Time, budget, engagement' },
  { id: 'you', label: 'You', hint: 'Where to send the answer' },
  { id: 'review', label: 'Review', hint: 'Check and send' }
];

/* ---------------------------------------------------------------- inputs */

function ChoiceCards({ options, value, onChange, name }) {
  return (
    <div className="choice" role="radiogroup" aria-label={name}>
      {options.map((option) => {
        const selected = value === option.label;
        return (
          <button
            type="button"
            key={option.id}
            role="radio"
            aria-checked={selected}
            className={`choice__card${selected ? ' is-selected' : ''}`}
            onClick={() => onChange(option.label)}
          >
            <span className="choice__tick" aria-hidden="true" />
            <span className="choice__label">{option.label}</span>
            <span className="choice__note faint">{option.note}</span>
          </button>
        );
      })}
    </div>
  );
}

function Chips({ options, values, onToggle, columns = false }) {
  return (
    <ul className={`chipset${columns ? ' chipset--columns' : ''}`}>
      {options.map((option) => {
        const selected = values.includes(option);
        return (
          <li key={option}>
            <button
              type="button"
              aria-pressed={selected}
              className={`chip chip--toggle${selected ? ' is-selected' : ''}`}
              onClick={() => onToggle(option)}
            >
              {option}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

function Pills({ options, value, onChange, label }) {
  return (
    <div className="pills" role="radiogroup" aria-label={label}>
      {options.map((option) => (
        <button
          type="button"
          key={option}
          role="radio"
          aria-checked={value === option}
          className={`pill${value === option ? ' is-selected' : ''}`}
          onClick={() => onChange(value === option ? '' : option)}
        >
          {option}
        </button>
      ))}
    </div>
  );
}

function Field({ label, error, hint, children, required }) {
  return (
    <label className={`field${error ? ' has-error' : ''}`}>
      <span className="field__label">
        {label}
        {required ? <span className="field__req" aria-hidden="true"> *</span> : null}
      </span>
      {children}
      {hint && !error ? <span className="field__hint faint">{hint}</span> : null}
      {error ? <span className="field__error" role="alert">{error}</span> : null}
    </label>
  );
}

/* ------------------------------------------------------------------ form */

export default function BriefForm() {
  const [step, setStep] = useState(0);
  const [form, setForm] = useState(() => {
    if (typeof window === 'undefined') return EMPTY;
    try {
      const saved = window.localStorage.getItem(DRAFT_KEY);
      return saved ? { ...EMPTY, ...JSON.parse(saved) } : EMPTY;
    } catch {
      return EMPTY;
    }
  });
  const [errors, setErrors] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | done | error
  const [serverError, setServerError] = useState('');
  const [reference, setReference] = useState('');
  const panelRef = useRef(null);

  // Keep a draft so a long brief survives a refresh or an accidental back.
  useEffect(() => {
    try {
      const { website, ...rest } = form;
      window.localStorage.setItem(DRAFT_KEY, JSON.stringify(rest));
    } catch {
      /* private mode; the draft is a convenience, not a requirement */
    }
  }, [form]);

  const set = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => (prev[key] ? { ...prev, [key]: undefined } : prev));
  };

  const toggle = (key, option) =>
    setForm((prev) => {
      const list = prev[key];
      return {
        ...prev,
        [key]: list.includes(option) ? list.filter((item) => item !== option) : [...list, option]
      };
    });

  function validate(index) {
    const found = {};
    if (index === 0 && !form.projectType) {
      found.projectType = 'Choose the closest match. You can refine it later.';
    }
    if (index === 4) {
      if (!form.name.trim()) found.name = 'We need a name to address the reply to.';
      if (!form.email.trim()) found.email = 'An email address is required.';
      else if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
        found.email = 'That address does not look right.';
      }
      if (form.summary.trim().length < 20) {
        found.summary = 'A sentence or two, please. It saves us both a call.';
      }
    }
    setErrors(found);
    return Object.keys(found).length === 0;
  }

  function go(next) {
    if (next > step && !validate(step)) return;
    setStep(Math.max(0, Math.min(next, STEPS.length - 1)));
    panelRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  async function onSubmit(event) {
    event.preventDefault();
    if (!validate(4)) {
      setStep(4);
      return;
    }
    setStatus('sending');
    setServerError('');
    try {
      const result = await submitBrief(form);
      setReference(result.reference ?? '');
      setStatus('done');
      try {
        window.localStorage.removeItem(DRAFT_KEY);
      } catch {
        /* ignore */
      }
    } catch (error) {
      if (error.fieldErrors) {
        setErrors(error.fieldErrors);
        setStep(error.fieldErrors.projectType ? 0 : 4);
      }
      setServerError(error.message);
      setStatus('error');
    }
  }

  const selectedCount = useMemo(
    () => form.stack.length + form.features.length + form.platforms.length + form.design.length,
    [form]
  );

  const progress = (step + 1) / STEPS.length;

  if (status === 'done') {
    return (
      <section className="section" id="brief">
        <div className="shell">
          <div className="card brief brief--done">
            <div className="done__drop" aria-hidden="true" />
            <h2 className="h2">Brief received.</h2>
            <p className="lede">
              Your reference is <strong className="mono">{reference}</strong>. A senior engineer
              reads every brief personally, and you will have a scoped reply within one business
              day. Nothing else is needed from you right now.
            </p>
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => {
                setForm(EMPTY);
                setStep(0);
                setStatus('idle');
              }}
            >
              Submit another project
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="section" id="brief">
      <div className="shell">
        <SectionHead eyebrow="Start a project" title="Tell us what you need built.">
          Six short steps, about three minutes. Everything except your name, email and a short
          description is optional, and nothing here commits you to anything.
        </SectionHead>

        <form className="card brief" onSubmit={onSubmit} ref={panelRef} noValidate>
          {/* progress ------------------------------------------------- */}
          <div className="brief__progress">
            <ol className="brief__steps">
              {STEPS.map((entry, i) => (
                <li key={entry.id}>
                  <button
                    type="button"
                    className={`brief__step${i === step ? ' is-current' : ''}${i < step ? ' is-done' : ''}`}
                    onClick={() => go(i)}
                    aria-current={i === step ? 'step' : undefined}
                  >
                    <span className="brief__step-dot" aria-hidden="true" />
                    <span className="brief__step-label">{entry.label}</span>
                  </button>
                </li>
              ))}
            </ol>
            <div className="brief__tube" aria-hidden="true">
              <div className="brief__level" style={{ transform: `scaleX(${progress})` }} />
            </div>
            <p className="faint mono brief__hint">
              Step {step + 1} of {STEPS.length} — {STEPS[step].hint}
            </p>
          </div>

          {/* panels --------------------------------------------------- */}
          <div className="brief__panel" key={step}>
            {step === 0 && (
              <>
                <fieldset className="fs">
                  <legend className="fs__legend">
                    What do you want built? <span className="field__req">*</span>
                  </legend>
                  <ChoiceCards
                    name="Project type"
                    options={projectTypes}
                    value={form.projectType}
                    onChange={(value) => set('projectType', value)}
                  />
                  {errors.projectType ? (
                    <p className="field__error" role="alert">{errors.projectType}</p>
                  ) : null}
                </fieldset>

                <fieldset className="fs">
                  <legend className="fs__legend">Which platforms does it need to reach?</legend>
                  <Chips
                    options={platforms}
                    values={form.platforms}
                    onToggle={(option) => toggle('platforms', option)}
                  />
                </fieldset>
              </>
            )}

            {step === 1 && (
              <fieldset className="fs">
                <legend className="fs__legend">Any technology you want us to use, or avoid?</legend>
                <p className="faint fs__note">
                  Optional. Select what you already run in-house, or skip the whole step and we will
                  recommend a stack in the reply.
                </p>
                <div className="brief__stacks">
                  {stackGroups.map((group) => (
                    <div className="brief__stack-group" key={group.id}>
                      <h4 className="brief__stack-title mono">{group.label}</h4>
                      <Chips
                        options={group.items}
                        values={form.stack}
                        onToggle={(option) => toggle('stack', option)}
                      />
                    </div>
                  ))}
                </div>
              </fieldset>
            )}

            {step === 2 && (
              <>
                <fieldset className="fs">
                  <legend className="fs__legend">What does it need to do?</legend>
                  <Chips
                    options={featureOptions}
                    values={form.features}
                    onToggle={(option) => toggle('features', option)}
                  />
                </fieldset>

                <fieldset className="fs">
                  <legend className="fs__legend">Where are you with design?</legend>
                  <Chips
                    options={designNeeds}
                    values={form.design}
                    onToggle={(option) => toggle('design', option)}
                  />
                </fieldset>
              </>
            )}

            {step === 3 && (
              <>
                <fieldset className="fs">
                  <legend className="fs__legend">When do you need it?</legend>
                  <Pills
                    label="Timeline"
                    options={timelines}
                    value={form.timeline}
                    onChange={(value) => set('timeline', value)}
                  />
                </fieldset>

                <fieldset className="fs">
                  <legend className="fs__legend">Rough budget</legend>
                  <p className="faint fs__note">
                    A range is enough. It tells us what to propose, not what to charge.
                  </p>
                  <Pills
                    label="Budget"
                    options={budgets}
                    value={form.budget}
                    onChange={(value) => set('budget', value)}
                  />
                </fieldset>

                <fieldset className="fs">
                  <legend className="fs__legend">How would you like to work?</legend>
                  <Pills
                    label="Engagement model"
                    options={engagements}
                    value={form.engagement}
                    onChange={(value) => set('engagement', value)}
                  />
                </fieldset>
              </>
            )}

            {step === 4 && (
              <>
                <div className="grid grid--two">
                  <Field label="Your name" error={errors.name} required>
                    <input
                      type="text"
                      value={form.name}
                      autoComplete="name"
                      onChange={(event) => set('name', event.target.value)}
                    />
                  </Field>
                  <Field label="Work email" error={errors.email} required>
                    <input
                      type="email"
                      value={form.email}
                      autoComplete="email"
                      onChange={(event) => set('email', event.target.value)}
                    />
                  </Field>
                  <Field label="Company">
                    <input
                      type="text"
                      value={form.company}
                      autoComplete="organization"
                      onChange={(event) => set('company', event.target.value)}
                    />
                  </Field>
                  <Field label="Phone" hint="Only if you prefer a call.">
                    <input
                      type="tel"
                      value={form.phone}
                      autoComplete="tel"
                      onChange={(event) => set('phone', event.target.value)}
                    />
                  </Field>
                  <Field label="Country or timezone">
                    <input
                      type="text"
                      value={form.country}
                      onChange={(event) => set('country', event.target.value)}
                    />
                  </Field>
                  <Field label="How did you find us?">
                    <select value={form.referral} onChange={(event) => set('referral', event.target.value)}>
                      <option value="">Prefer not to say</option>
                      {referrals.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </select>
                  </Field>
                </div>

                <Field
                  label="Describe the project"
                  error={errors.summary}
                  hint="The problem, who it is for, and what has been tried already."
                  required
                >
                  <textarea
                    rows={6}
                    value={form.summary}
                    placeholder="We run a logistics business and our drivers still use paper manifests…"
                    onChange={(event) => set('summary', event.target.value)}
                  />
                </Field>

                <label className="check">
                  <input
                    type="checkbox"
                    checked={form.nda}
                    onChange={(event) => set('nda', event.target.checked)}
                  />
                  <span className="check__box" aria-hidden="true" />
                  <span>Send me an NDA before we discuss details</span>
                </label>

                {/* Honeypot: hidden from people, irresistible to bots. */}
                <div className="hp" aria-hidden="true">
                  <label>
                    Website
                    <input
                      type="text"
                      tabIndex={-1}
                      autoComplete="off"
                      value={form.website}
                      onChange={(event) => set('website', event.target.value)}
                    />
                  </label>
                </div>
              </>
            )}

            {step === 5 && (
              <div className="review">
                <p className="faint">
                  {selectedCount} option{selectedCount === 1 ? '' : 's'} selected. Click any row to
                  go back and change it.
                </p>
                <dl className="review__list">
                  {[
                    ['Project', form.projectType || '—', 0],
                    ['Platforms', form.platforms, 0],
                    ['Stack', form.stack, 1],
                    ['Features', form.features, 2],
                    ['Design', form.design, 2],
                    ['Timeline', form.timeline || 'Not specified', 3],
                    ['Budget', form.budget || 'Not specified', 3],
                    ['Engagement', form.engagement || 'Not specified', 3],
                    ['Name', form.name || '—', 4],
                    ['Email', form.email || '—', 4],
                    ['Company', form.company || '—', 4],
                    ['NDA', form.nda ? 'Requested' : 'Not requested', 4],
                    ['Summary', form.summary || '—', 4]
                  ].map(([label, value, target]) => (
                    <div className="review__row" key={label} onClick={() => go(target)}>
                      <dt className="mono faint">{label}</dt>
                      <dd>
                        {Array.isArray(value)
                          ? value.length
                            ? value.join(', ')
                            : 'None selected'
                          : value}
                      </dd>
                    </div>
                  ))}
                </dl>
                <p className="faint review__legal">
                  We use these details only to reply to your enquiry. No newsletter, no resale, and
                  you can ask us to delete the record at any time.
                </p>
              </div>
            )}
          </div>

          {serverError ? (
            <p className="brief__server-error" role="alert">{serverError}</p>
          ) : null}

          {/* controls -------------------------------------------------- */}
          <div className="brief__nav">
            <button
              type="button"
              className="btn btn--ghost"
              onClick={() => go(step - 1)}
              disabled={step === 0}
            >
              Back
            </button>

            {step < STEPS.length - 1 ? (
              <button type="button" className="btn btn--primary" onClick={() => go(step + 1)}>
                Continue <span className="btn__arrow" aria-hidden="true">→</span>
              </button>
            ) : (
              <button type="submit" className="btn btn--primary" disabled={status === 'sending'}>
                {status === 'sending' ? 'Sending…' : 'Send the brief'}
                <span className="btn__arrow" aria-hidden="true">→</span>
              </button>
            )}
          </div>
        </form>
      </div>
    </section>
  );
}
