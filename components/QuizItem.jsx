import { View, StyleSheet, Text } from "react-native";
import Choice from "./Choice";

export default function QuizItem({ info: { question, choices }, onSelect }) {
  return (
    <View style={styles.container}>
      <Text style={styles.question}>{question}</Text>
      {choices.map((choice, index) => (
        <Choice
          key={index}
          info={choice}
          question={question}
          onSelect={onSelect}
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    width: "90%",
    backgroundColor: "white",
    margin: 10,
    padding: 10,
  },
  question: {
    fontSize: 20,
  },
});
