import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import QuizItem from "./components/QuizItem";
import Quiz1 from "./Quizzes/Quiz1";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function App() {
  const [bestScore, setBestScore] = useState(0);
  const [firstAttemptScore, setFirstAttemptScore] = useState(0);

  useEffect(updateScores, []);

  const [currentScore, setCurrentScore] = useState(0);
  const [assessmentMode, setAssessmentMode] = useState(false);

  useEffect(async () => {
    if (assessmentMode) {
      try {
        const firstAttemptScoreStored = parseInt(
          await AsyncStorage.getItem("firstAttemptScore")
        );
        if (isNaN(firstAttemptScoreStored)) {
          await AsyncStorage.setItem("firstAttemptScore", currentScore + "");
        }

        const bestScoreStored = parseInt(
          await AsyncStorage.getItem("bestScore")
        );
        if (isNaN(bestScoreStored) || currentScore > bestScoreStored) {
          await AsyncStorage.setItem("bestScore", currentScore + "");
        }

        updateScores();
      } catch (error) {
        console.log(error);
      }
    }
  }, [assessmentMode]);

  async function updateScores() {
    try {
      const firstAttemptScoreStored = await AsyncStorage.getItem(
        "firstAttemptScore"
      );
      if (firstAttemptScoreStored !== null) {
        setFirstAttemptScore((prev) => parseInt(firstAttemptScoreStored));
      }
      const bestScoreStored = await AsyncStorage.getItem("bestScore");
      if (bestScoreStored !== null) {
        setBestScore((prev) => parseInt(bestScoreStored));
      }
    } catch (error) {
      console.log(error);
    }
  }

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

  async function onResetHandler() {
    setBestScore((prev) => 0);
    setFirstAttemptScore((prev) => 0);
    if (assessmentMode) {
      setAssessmentMode((prev) => false);

      let lol = [...quizItems];

      for (let item of lol) {
        for (let choice of item.choices) {
          choice.isSelected = false;
        }
      }
    }
    try {
      await AsyncStorage.clear();
      updateScores();
    } catch (e) {
      console.log(e);
    }
  }

  function onSubmitHandler() {
    if (assessmentMode) {
      setAssessmentMode((prev) => false);

      let lol = [...quizItems];

      for (let item of lol) {
        for (let choice of item.choices) {
          choice.isSelected = false;
        }
      }

      setQuizItems((prev) => lol);
      return;
    }
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
          <Button title="Reset" onPress={onResetHandler} />
        </View>
        {assessmentMode && <Text>Your Current Score is {currentScore}</Text>}
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
      <Button
        title={assessmentMode ? "Try Again" : "Submit"}
        onPress={onSubmitHandler}
      />
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
