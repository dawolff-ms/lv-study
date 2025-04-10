import {
  Button,
  Field,
  Radio,
  RadioGroup,
  RadioGroupOnChangeData,
  SpinButton,
  Subtitle1,
  Title1,
  makeStyles,
} from "@fluentui/react-components";

import { AppRoutes } from "../../constants/AppRoutes";
import Flex from "../common/Flex";
import { useNavigate } from "react-router";
import React from "react";
import SurveyContext from "../../contexts/SurveyContext";
import { SurveyMode } from "../../controllers/SurveyController";

const useStyles = makeStyles({


  container: {
    backgroundColor: "#220A32",
    minHeight: "100vh",
    display: "flex",
    "& section": {
      padding: "0",
      minHeight: "300px",
      display: "block",
    },
    "& li, p": {
      fontSize: "16px",
    },
    "& ol": {
      paddingLeft: "20px",
    },
    "& li": {
      padding: "10px 0",
    },
    "& section:nth-of-type(1)": {
      backgroundColor: "#111",
      padding:"20px 0",
    },
    "& section:nth-of-type(2)": {
      color: "#E7C5F9",
      backgroundColor: "#4A1666",
      position: "relative",
      "& div":{
        position: "relative",
      },
      "& div:after": {
        content: '""',
        position: "absolute",
        top: "-80px", 
        left: "-115px", 
        width: "100px", 
        height: "100px", 
        backgroundImage: "url('/design/icon-heart.png')", 
        backgroundSize: "contain", 
        backgroundRepeat: "no-repeat", 
      },
    
    },
    "& section:nth-of-type(3)": {
      backgroundColor: "#220A32",
    },
  },
  button: {
    margin: "16px auto",
    background: "#7212C3",
  },
  homeField: {
    maxWidth: "300px",
    margin: "20px 0",
  },
  homeSection: {
    margin: "40px auto",
    maxWidth: "920px",
  },

  homeBorder: {
    width: "100%",
    maxHeight: "20px",
    margin:"10px 0 20px",
  },

  gradientTitle: {
    background: "linear-gradient(to right, #A84BF9, #E244B0, #EE7B2F)",
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    margin: "20px 0 10px",
    display: "inline-block",
    position: "relative", 
    fontSize: "40px",
    lineHeight: "1.2em",
    "&::after": {
      content: '""',
      position: "absolute",
      top: "-40px", 
      right: "-100px", 
      width: "80px",
      height: "80px",
      backgroundImage: "url('/design/icon-hand.png')", 
      backgroundSize: "contain", 
      backgroundRepeat: "no-repeat",
    },
  },
  
});

export default function LandingPage() {
  const styles = useStyles();
  const navigate = useNavigate();

  const { mode, setMode, breakCadence, setBreakCadence } =
    React.useContext(SurveyContext);

  return (
    <Flex  className={styles.container}>

      <section>
        <div className={styles.homeSection}> 
          <Title1 as="h1" className={styles.gradientTitle}> Hello - thank you for participating in this study</Title1>

          <img src="/design/border-squiggly.png" alt="A squiggly border design. Fun!" className={styles.homeBorder} />

          <Subtitle1 as="h2">Instructions</Subtitle1>
         
        
          
          <ol>
          <li>
          You'll be shown a series of designs for a text box, in either light or
            dark mode based on your selection. Each design will be shown one at a
            time.
              
            </li>
            <li>
                If you recognize an input field, press the space bar or click
                anywhere with your mouse. If you don't recognize an input field, don't take any action.
              
            </li>
            <li>
              
            There are no wrong answers. It's important for us to understand which
            designs are or are not perceivable, so your honest response is
            appreciated.
              
            </li>
          </ol>
        </div>
      </section>
      
      <section>
        <div className={styles.homeSection}>
         

          <Subtitle1 as="h2">Rest breaks</Subtitle1>
        
            <p>You can choose how often you want to take a break while completing the
            survey. Based on your selection, the survey will automatically pause.
            </p>
            <p>
            Please feel free to close your eyes or whatever way you need to reset,
            and take as much time as you need. Once you're ready to continue, press
            the space bar on your keyboard or click your mouse.
            <p>
            </p>
            Also if at any other point you want to take a break, please let the
            moderator know.
            </p>
          
        </div>
      </section>

      <section>
        <div className={styles.homeSection}>
          <Subtitle1 as="h2">Begin the survey</Subtitle1>

          <Field label="Select the mode you'd like to test:">
            <RadioGroup
              value={mode}
              onChange={(_, data: RadioGroupOnChangeData) =>
                setMode(data.value as SurveyMode)
              }
            >
              {/*<Radio value="both" label="Light and Dark mode"/>*/}
              <Radio value="light" label="Light mode" />
              <Radio value="dark" label="Dark mode" />
            </RadioGroup>
          </Field>

          <Field className={styles.homeField} label="Select how many tests to perform in a row before taking a break:">
            <SpinButton
              stepPage={5}
              min={1}
              value={breakCadence}
              onChange={(_, data) => {
                const value = data.value ?? parseInt(data.displayValue ?? "");
                if (Number.isNaN(value)) return;
                setBreakCadence(value);
              }}
            />
          </Field>

          <Button
            className={styles.button}
            appearance="primary"
            size="large"
            onClick={() => navigate(AppRoutes.SURVEY)}
          >
            Start Survey
          </Button>
        </div>
      </section>
    </Flex>
  );
}
