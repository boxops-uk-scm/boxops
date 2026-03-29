import { useState } from "react";
import * as stylex from "@stylexjs/stylex";
import React from "react";
 
const styles = stylex.create({
  section: {
    backgroundColor: '#f8f8f8',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: '6rem',
    paddingInline: '1rem',
  },
  header: {
    maxWidth: '1200px',
    marginInline: 'auto',
    padding: '2rem 1rem 1rem',
    fontSize: '2rem',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  p: {
    maxWidth: '600px',
    marginInline: 'auto',
    padding: '0 1rem 2rem',
    fontSize: '1.25rem',
    textAlign: 'center',
    color: '#555',
  },
  list: {
    maxWidth: '800px',
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  item: {

  },
  button: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    padding: "0.5rem 0",
    backgroundColor: "transparent",
    textAlign: "left",
    fontSize: "1rem",
    fontWeight: "500",
    cursor: "pointer",
    outline: "none",
    borderWidth: '0',
  },
  icon: {
    width: "1.5rem",
    flexShrink: "0",
    marginLeft: "1rem",
    fontSize: "1.2rem",
    userSelect: "none",
    textAlign: "center",
  },
  answer: {
    overflow: "hidden",
    maxHeight: "0",
    transition: "max-height 0.25s ease",
  },
  answerOpen: {
    maxHeight: "200px",
  },
  answerInner: {
    paddingBottom: "1rem",
    fontSize: "0.9rem",
    lineHeight: "1.6",
    maxWidth: '95%',
  },
  spacer: {
    width: '100%',
    height: '1px',
    backgroundColor: '#c9c9c9',
    marginTop: '0.5rem',
    marginBottom: '0.5rem',
  }
});
 
const faqs = [
  {
    question: "What do your lessons include?",
    answer: "Our lessons include one to one sessions with one of our tutors, with the content customised to your needs. You will also be given paper handouts with supporting material for all your lessons that will create your 'Learning Journey' over time."
  },
  {
    question: "I have never played the guitar before, can you help me?",
    answer: "Of course! Everyone starts somewhere and if we can show you what to do and what not to do from the very beginning, you will become a great guitarist!"
  },
  {
    question: "I have been playing for a few years, can you teach me anything new?",
    answer: "Our lead tutor has been playing the guitar for around 30 years and still finds something new almost every time he plays!"
  },
  {
    question: "Where would the lessons take place?",
    answer: "Lessons take place in a quiet custom built guitar studio in Medbourne, Milton Keynes."
  },
  {
    question: "Are you tutors CRB (criminal record) checked?",
    answer: "Absolutely! All of our tutors are fully vetted."
  },
  {
    question: "How much do guitar lessons cost?",
    answer: "Lessons are priced at £21.25 for 30 minutes, paid monthly in advance and include all printed materials, homework (if you want it!) and access to online resources, not to mention use of our guitars, amps and accessories! We also have pay as you go (or ad - hoc) lessons available if you're not able to come in every week."
  },
  {
    question: "What styles do you teach?",
    answer: "We can teach you any style on any guitar except classical!"
  },
  {
    question: "Do I need my own instrument?",
    answer: "Whilst it would be a massive advantage to have your own guitar, we can supply both electric and acoustic guitars when you first begin lessons."
  },
  {
    question: "Can I bring someone with me to my lessons?",
    answer: "Of course! If you would prefer to have a parent or guardian with you during the lessons, they are more than welcome."
  },
  {
    question: "Are you insured?",
    answer: "Yes, we are fully insured for both your safety and ours!"
  },
  {
    question: "Can I take one of your guitars home to practise on?",
    answer: "Unfortunately not but we can arrange guitar hire for you from just £6 per week!"
  },
];
 
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [open, setOpen] = useState(false);
 
  return (
    <li {...stylex.props(styles.item)}>
      <button
        {...stylex.props(styles.button)}
        onClick={() => setOpen((prev) => !prev)}
        aria-expanded={open}
      >
        <strong>{question}</strong>
        <span {...stylex.props(styles.icon)}>{open ? '–' : '+'}</span>
      </button>
      <div
        {...stylex.props(styles.answer, open && styles.answerOpen)}
        aria-hidden={!open}
      >
        <p {...stylex.props(styles.answerInner)}>{answer}</p>
      </div>
    </li>
  );
}
 
export default function FAQList() {
  return (
    <div {...stylex.props(styles.section)}>
      <h2 {...stylex.props(styles.header)}>Frequently Asked Questions</h2>
      <ul {...stylex.props(styles.list)}>
        {faqs.map((faq,i) => (
          <React.Fragment key={i}>
            {i > 0 && <div {...stylex.props(styles.spacer)} />}
            <FAQItem question={faq.question} answer={faq.answer} />
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
}