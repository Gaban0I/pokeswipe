import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const Card = ({ name, sprite, id, height, weight }) => {
    console.log(sprite);
    return (
        <View style={styles.card}>
            <Image style={styles.sprite} source={{ uri: sprite }} />
            <Text style={styles.name}>{name}</Text>
            <Text>ID: {id}</Text>
            <Text>Height: {height}</Text>
            <Text>Weight: {weight}</Text>
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
        shadowColor: 'black',
        shadowOpacity: 0.2,
        shadowOffset: { width: 0, height: 2 },
        shadowRadius: 4,
        elevation: 2,
    },
    sprite: {
        width: 100,
        height: 100,
        marginBottom: 8,
    },
    name: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 8,
    },
});

export default Card;
