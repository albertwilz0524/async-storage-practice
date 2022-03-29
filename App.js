import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import QuizItem from "./components/QuizItem";
import Quiz1 from "./Quizzes/Quiz1";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [bestScore, setBestScore] = useState(0);
  const [firstAttemptScore, setFirstAttemptScore] = useState(0);
  const [currentScore, setCurrentScore] = useState(0);
  const [assessmentMode, setAssessmentMode] = useState(false);
  const [showCurrentScore, setShowCurrentScore] = useState(false);

  let bestScoreStored;
  let firstAttemptScoreStored;

  let quiz = [];

  Quiz1.map((item) => {
    let choicesWithSelected = [];
    let choicesWithoutSelected = item.choices;
    choicesWithoutSelected.map((choice) =>
      choicesWithSelected.push({ ...choice, isSelected: false })
    );

    let itemWithSelected = { ...item, choices: choicesWithSelected };

    return quiz.push(itemWithSelected);
  });

  const [quizItems, setQuizItems] = useState(quiz);

  function onSelectHandler(question, choiceName) {
    if (assessmentMode) {
      return;
    }
    let newQuizItems = [];
    quizItems.map((item) => {
      if (item.question !== question) {
        return newQuizItems.push(item);
      } else {
        let newQuizItemChoices = [];
        item.choices.map((choice) => {
          if (choice.name === choiceName) {
            return newQuizItemChoices.push({
              ...choice,
              isSelected: !choice.isSelected,
            });
          } else {
            return newQuizItemChoices.push({ ...choice, isSelected: false });
          }
        });
        newQuizItems.push({ ...item, choices: newQuizItemChoices });
      }
    });
    setQuizItems((prev) => newQuizItems);
  }

  async function onSubmitHandler() {
    setAssessmentMode((prev) => true);
    let score = 0;
    for (let item of quizItems) {
      for (let choice of item.choices) {
        if (choice.isSelected && choice.isCorrect) {
          score++;
        }
      }
    }
    setCurrentScore((prev) => score);
    setShowCurrentScore((prev) => true);

    try {
      firstAttemptScoreStored = await AsyncStorage.getItem(
        "firstAttemptScoreQuiz1"
      );
      if (firstAttemptScoreStored === null) {
        try {
          await AsyncStorage.setItem("firstAttemptScoreQuiz1", currentScore);
        } catch (error) {
          console.log(error);
        }
      }

      bestScoreStored = await AsyncStorage.getItem("bestScoreStoredQuiz1");
      if (bestScoreStored < currentScore || bestScoreStored === null) {
        await AsyncStorage.setItem("bestScoreStoredQuiz1", currentScore);
      }
    } catch (error) {
      console.log(error);
    }
  }

  async function getAsyncScore() {
    try {
      bestScoreStored = await AsyncStorage.getItem("bestScoreQuiz1");
      if (bestScoreStored !== null) {
        setBestScore((prev) => bestScoreStored);
      }
      firstAttemptScoreStored = await AsyncStorage.getItem(
        "firstAttemptScoreQuiz1"
      );
      if (firstAttemptScoreStored !== null) {
        setFirstAttemptScore((prev) => firstAttemptScoreStored);
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={styles.container}>
      <View style={styles.titleContainer}>
        <Text style={styles.title}>The Ultimate Quiz!</Text>
        <View style={styles.scoresContainer}>
          <Text style={styles.textScore}>Best Score: {bestScore}</Text>
          <Text style={styles.textScore}>
            First Attempt: {firstAttemptScore}
          </Text>
          <Button title="Reset" />
        </View>
        {showCurrentScore && <Text>Your Current Score is {currentScore}</Text>}
      </View>
      <ScrollView
        style={styles.quizItemsContainer}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {quizItems.map((quizItem, index) => (
          <QuizItem
            key={index}
            info={quizItem}
            onSelect={onSelectHandler}
            assessmentMode={assessmentMode}
          />
        ))}
      </ScrollView>
      <Button title="Submit" onPress={onSubmitHandler} />
      <StatusBar hidden />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  quizItemsContainer: {
    flex: 1,
    backgroundColor: "#333",
  },
  title: {
    fontSize: 60,
    color: "black",
    fontWeight: "bold",
  },
  scoresContainer: {
    height: "50%",
    width: "90%",
    backgroundColor: "#ededed",
    justifyContent: "center",
  },
  textScore: {
    fontSize: 20,
  },
  titleContainer: {
    height: "30%",
    width: "100%",
    alignItems: "center",
  },
});
