import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

const Card = ({ name, sprite, id, height, weight, type }) => {
  let color = "#A4A4A4";

  switch (type) {
    case "normal":
      color = "#A0A29F";
      break;
    case "grass":
      color = "#5FBD58";
      break;
    case "fire":
      color = "#FBA54C";
      break;
    case "fighting":
      color = "#D3425F";
      break;
    case "water":
      color = "#539DDF";
      break;
    case "electric":
      color = "#F2D94E";
      break;
    case "bug":
      color = "#92BC2C";
      break;
    case "dark":
      color = "#595761";
      break;
    case "dragon":
      color = "#0C69C8";
      break;
    case "fairy":
      color = "#EE90E6";
      break;
    case "flying":
      color = "#A1BBEC";
      break;
    case "ghost":
      color = "#5F6DBC";
      break;
    case "ground":
      color = "#DA7C4D";
      break;
    case "ice":
      color = "#75D0C1";
      break;
    case "poison":
      color = "#B763CF";
      break;
    case "psychic":
      color = "#FA8581";
      break;
    case "rock":
      color = "#C9BB8A";
      break;
    case "steel":
      color = "#5695A3";
      break;
    default:
      color = "#A4A4A4";
      break;
  }

  return (
    <View
      style={[
        styles.card,
        {
          shadowColor: color,
          shadowOffset: {
            width: 0,
            height: 0,
          },
          shadowOpacity: 0.9,
          shadowRadius: 100,
          elevation: 10,
        },
      ]}
    >
      <Image style={styles.sprite} source={{ uri: sprite }} />
      <Text style={styles.name}>{name}</Text>
      <Text>ID: {id}</Text>
      <Text>Height: {height}</Text>
      <Text>Weight: {weight}</Text>
      <Text>Type: {type}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "white",
    borderRadius: 8,
    padding: 16,
    marginVertical: 8,
    alignItems: "center",
  },
  sprite: {
    width: 400 * 0.5,
    height: 400 * 0.5,
    marginBottom: 8,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 8,
  },
});

export default Card;
