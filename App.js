import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, TouchableOpacity } from 'react-native';
import Card from './component/Card';

export default function App() {
  const [poke, setPoke] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likeOpacity] = useState(new Animated.Value(1));
  const [dislikeOpacity] = useState(new Animated.Value(1));
  const [pan] = useState(new Animated.ValueXY());

  useEffect(() => {
    getPoke();
  }, []);

  const getPoke = async () => {
    {
      fetch("https://pokeapi.co/api/v2/pokemon")
        .then((res) => res.json())
        .then((json) => {
          console.log(json);
          Promise.all(
            json.results.map((poke) => {
              return fetch(poke.url)
                .then((res) => res.json())
                .then((data) => {
                  return data;
                });
            })
          ).then((pokeList) => {
            setPoke(pokeList);
            setIsLoading(false);
          });
        });
    }
  };

  const handleSwipe = (direction) => {
    if (direction === 'right') {
      Animated.timing(likeOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    } else if (direction === 'left') {
      Animated.timing(dislikeOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: false,
      }).start();
    }
    setCurrentIndex(currentIndex + 1);
    resetCard();
  };

  const resetCard = () => {
    Animated.spring(likeOpacity, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
    Animated.spring(dislikeOpacity, {
      toValue: 0,
      useNativeDriver: false,
    }).start();
    Animated.spring(pan, {
      toValue: { x: 0, y: 0 },
      useNativeDriver: false,
    }).start();
  };

  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: Animated.event(
      [
        null,
        {
          dx: pan.x,
          dy: pan.y,
        },
      ],
      { useNativeDriver: false }
    ),
    onPanResponderRelease: (event, gesture) => {
      if (gesture.dx > 120) {
        handleSwipe('right');
      } else if (gesture.dx < -120) {
        handleSwipe('left');
      } else {
        resetCard();
      }
    },
  });

  const renderPokeCards = () => {
    if (currentIndex >= poke.length) {
      return <Text>No more Pokémon to show!</Text>;
    }
    return poke.map((p, index) => {
      if (index === currentIndex) {
        return (
          <Animated.View
            {...panResponder.panHandlers}
            key={p.name}
            style={[
              {
                transform: [
                  { translateX: pan.x },
                  { translateY: pan.y },
                  { rotate: pan.x.interpolate({ inputRange: [-200, 0, 200], outputRange: ['-30deg', '0deg', '30deg'] }) },
                ],
              },
            ]}
          >
            <Card
              name={p.name}
              sprite={p.sprites?.front_default}
              id={p.id}
              height={p.height}
              weight={p.weight}
            />
          </Animated.View>
        );
      }
      return null;
    });
  };

  const handleLike = () => {
    Animated.timing(likeOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setCurrentIndex(currentIndex + 1);
  };

  const handleDislike = () => {
    Animated.timing(dislikeOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    setCurrentIndex(currentIndex + 1);
  };

  return (
    <View style={styles.container}>
      {renderPokeCards()}
      <View style={styles.buttonsContainer}>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleDislike}>
          <Animated.Text style={[styles.buttonText, { opacity: dislikeOpacity }]}>Dislike</Animated.Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.button, { backgroundColor: 'green' }]} onPress={handleLike}>
          <Animated.Text style={[styles.buttonText, { opacity: likeOpacity }]}>Like</Animated.Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 16,
  },
  button: {
    borderRadius: 8,
    paddingVertical: 12,
    paddingHorizontal: 24,
    marginHorizontal: 8,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

// https://sharemycode.fr/qjf