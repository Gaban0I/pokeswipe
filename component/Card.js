import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Card = ({ name, sprite, id, height, weight, type }) => {
    let color = "#A4A4A4";

    switch (type) {
        case "normal":
            color = "#A4A4A4";
            break;
        case "grass":
            color = "#78C850";
            break;
        case "fire":
            color = "#F08030";
            break;
        case "fighting":
            color = "#C03028";
            break;
        case "water":
            color = "#6890F0";
            break;
        case "electric":
            color = "#98D8D8";
            break;
        case "bug":
            color = "#A8B820"
            break;
        default:
            color = "#A4A4A4";
            break;
    }

    return (
        <View style={[styles.card, {
            shadowColor: color,
            shadowOffset: {
                width: 0,
                height: 0,
            },
            shadowOpacity: 0.9,
            shadowRadius: 100,
            elevation: 10,
        }]}>
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
        backgroundColor: 'white',
        borderRadius: 8,
        padding: 16,
        marginVertical: 8,
        alignItems: 'center',

    },
    sprite: {
        width: 400 * 0.5,
        height: 400 * 0.5,
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default Card;
