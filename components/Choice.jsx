import { Pressable, StyleSheet, Text } from "react-native";

export default function Choice({ info, onSelect, question }) {
  const styles = StyleSheet.create({
    containerSelected: {
      alignSelf: "center",
      margin: 5,
      height: 50,
      width: "80%",
      backgroundColor: "lightgreen",
      borderColor: "green",
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    containerNotSelected: {
      alignSelf: "center",
      margin: 5,
      height: 50,
      width: "80%",
      backgroundColor: "white",
      borderColor: "black",
      borderWidth: 2,
      justifyContent: "center",
      alignItems: "center",
    },
    text: {
      fontSize: 20,
    },
  });
  return (
    <Pressable
      style={
        info.isSelected ? styles.containerSelected : styles.containerNotSelected
      }
      onPress={() => {
        onSelect(question, info.name);
      }}
    >
      <Text style={styles.text}>{info.name}</Text>
    </Pressable>
  );
}
