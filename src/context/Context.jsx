import { createContext, useState } from "react";
import runChat from "../config/gemini";

export const Context = createContext();

const ContextProvider = (props) => {
  const [input, setInput] = useState("");
  const [recentPrompt, setRecentPrompt] = useState("");
  const [prevPrompts, setPrevPrompts] = useState([]);
  const [showResult, setShowResult] = useState(false);
  const [loading,setLoading]=useState(false);
  const [resultData,setResultData]=useState("");

  const delayPara=(index,nextWord)=>{
    setTimeout(() => {
      setResultData(prev=>prev+nextWord);
    }, 75*index);
  }
  const newChat=()=>{
    setLoading(false);
    setShowResult(false);
  }

  const onSent = async (prompt) => {
    try{
    setResultData("");
    setLoading(true);//to display animation
    setShowResult(true);
    let response;
    if(prompt!==undefined){
      response=await runChat(prompt);
      setRecentPrompt(prompt)
    }
    else{
      setPrevPrompts(prev=>[...prev,input])
      setRecentPrompt(input);
      response =await runChat(input)
    }
    // setRecentPrompt(input);
    // setPrevPrompts(prev=>[...prev,input]);
    // const response=await runChat(input);
    let formatted = response;

    // Bold: **text**
    formatted = formatted.replace(/\*\*(.*?)\*\*/g, "<b>$1</b>");

    // Headings: ==== or ----
    formatted = formatted.replace(/=+/g, "");
    formatted = formatted.replace(/-+/g, "");

    // New lines to <br/>
    formatted = formatted.replace(/\n/g, "<br/>");

    // Remove extra spaces
    formatted = formatted.trim();

    let newResponseArray=formatted.split(" ");
    for(let i=0;i<newResponseArray.length;i++){
      const nextWord=newResponseArray[i];
      delayPara(i,nextWord+" ");
    }

    setResultData(formatted);
    setInput("");
  } catch (err) {
    console.error(err);
    setResultData("Error: Unable to get response.");
  } finally {
    setLoading(false);
  }
};
  // onSent("What is groq ai");

  const contextValue = {
    prevPrompts,
    setPrevPrompts,
    onSent,
    recentPrompt,
    setRecentPrompt,
    showResult,
    loading,
    resultData,
    input,
    setInput,
    newChat
  };

  return (
    <Context.Provider value={contextValue}>{props.children}</Context.Provider>
  );
};

export default ContextProvider;
