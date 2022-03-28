import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, Button, ScrollView } from "react-native";
import { useState, useEffect } from "react";
import QuizItem from "./components/QuizItem";
import Quiz1 from "./Quizzes/Quiz1";

export default function App() {
  const [bestScore, setBestScore] = useState(0);
  const [firstAttemptScore, setFirstAttemptScore] = useState(0);

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
      </View>
      <ScrollView
        style={styles.quizItemsContainer}
        contentContainerStyle={{ alignItems: "center" }}
      >
        {quizItems.map((quizItem, index) => (
          <QuizItem key={index} info={quizItem} onSelect={onSelectHandler} />
        ))}
      </ScrollView>
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
    backgroundColor: "#5566cc",
  },
  title: {
    fontSize: 60,
    color: "#ffffff",
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
    backgroundColor: "red",
    alignItems: "center",
  },
});
