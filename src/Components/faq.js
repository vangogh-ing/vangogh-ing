const FAQ = () => {
  return (
    <div id="container">
      <div>
        <h1>Frequently Asked Questions</h1>
      </div>
      <div className="faqImageDiv">
        <img className="faqImg" src="/vangoghfaq.jpg" />
      </div>

      <div className="faqCard">
        <div className="faqBox">
          <h2>WHAT IS VANGOGH-ING?</h2>
          <p className="faqWords">
            Vangogh-ing is a web application that connects you with art and
            culture events happening around New York City.
          </p>
        </div>

        <div className="faqBox">
          <h2>HOW TO USE VANGOGH-ING</h2>
          <p className="faqWords">
            Make an account! Making an account allows you to follow art
            organizations and add events to your calendar.
          </p>
        </div>

        <div className="faqBox">
          <h2>HOW TO FOLLOW ORGANIZATIONS AND EVENTS</h2>
          <p className="faqWords">
            Find an event and press the Save button, that will bring up a pop up
            that urges you to choose whether you are Interested or Attending an
            event. This choice will be reflected in your Calendar and will allow
            an Organization to see how successful their events are.
          </p>
        </div>

        <div className="faqBox">
          <h2>WHAT IS THE FOR YOU PAGE?</h2>
          <p className="faqWords">
            The For You page is solely based on the organizations that you
            choose to follow. This allows you to sort through events from
            organizations you have more interest in more easily.
          </p>
        </div>

        <div className="faqBox">
          <h2>HOW DOES THE CALENDAR WORK?</h2>
          <p className="faqWords">
            The calendar allows you to sort through the events you’ve marked as
            Interested or Attending, giving you a view of what your art
            endeavors could look like.
          </p>
        </div>

        <div className="faqBox">
          <h2>HOW TO MAKE AN ORGANIZATION</h2>
          <p className="faqWords">
            To make an organization, head to your profile and click the link
            “create an org?”. This will pull up a form for your organization.
            Initial creation only requires a name and an email, the other inputs
            can be filled in later. Voila, you now have an organization!
          </p>
        </div>

        <div className="faqBox">
          <h2>HOW TO MAKE AN EVENT</h2>
          <p className="faqWords">
            Now that you have an organization, it’s time to make an event. This
            can be done in Active Events, under the My Org Events tab in the
            navbar. Click on Create Event and fill out the form, once that’s
            done just click Create Event and your set! If you need to change
            anything in an event, you can always change it by clicking the
            update button and fixing your mistake, otherwise you can just delete
            the event by pressing the delete button.
          </p>
        </div>

        <div className="faqBox">
          <h2>WHAT ARE ACTIVE AND PAST EVENTS?</h2>
          <p className="faqWords">
            The active events tab is where you will find all your events that
            are currently in action. This is where you can update and delete
            them. The past events tab is for events that have passed - you can't
            change them even if you have a typo, live with your mistakes.
          </p>
        </div>
      </div>
    </div>
  );
};

export default FAQ;
