import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, PanResponder, Animated, TouchableOpacity, } from 'react-native';
import Card from '../component/Card';
import Loading from '../component/Loading';


export default function App() {
  const [poke, setPoke] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [likeOpacity] = useState(new Animated.Value(1));
  const [dislikeOpacity] = useState(new Animated.Value(1));
  const [pan] = useState(new Animated.ValueXY());
  const [isLoading, setIsLoading] = useState(true)
  const [pokeUrl, setPokeUrl] = useState("https://pokeapi.co/api/v2/pokemon")
  useEffect(() => {
    getPoke();
  }, []);

  const STORAGE_NAME = "PokeSwipe_734a1dc0-26df-11ee-be56-0242ac120002"

  const handleSetFav = (id) => {
    let dataStore = localStorage[STORAGE_NAME];
    if (!dataStore) {
      const newSavedStorage = {};
      newSavedStorage[id] = id;
      localStorage[STORAGE_NAME] = JSON.stringify(newSavedStorage);
    } else {
      dataStore = JSON.parse(dataStore);
      dataStore[id] = id;
      localStorage[STORAGE_NAME] = JSON.stringify(dataStore);
    }
  };

  const getPoke = async () => {
    try {
      const response = await fetch(pokeUrl);
      const json = await response.json();
      setPokeUrl(json.next);
      const pokeList = await Promise.all(
        json.results.map(async (poke) => {
          const res = await fetch(poke.url);
          const data = await res.json();
          return data;
        })
      );
      setPoke((prevPoke) => [...prevPoke, ...pokeList]);
      setIsLoading(false);
    } catch (error) {
      console.error(error);
    }
  };


  const handleSwipe = (direction) => {
    if (direction === 'right') {
      handleLike();
    } else if (direction === 'left') {
      handleDislike();
    }
    if (currentIndex == poke.length - 2) getPoke();
    setCurrentIndex(currentIndex + 1);
    resetCard();
  };

  const handleLike = () => {
    Animated.timing(likeOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    handleSetFav(currentIndex + 1)
    if (currentIndex == poke.length - 2) getPoke();

    setCurrentIndex(currentIndex + 1);
  };

  const handleDislike = () => {
    Animated.timing(dislikeOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false,
    }).start();
    if (currentIndex == poke.length - 2) getPoke();
    setCurrentIndex(currentIndex + 1);
  };

  const resetCard = () => {
    Animated.spring(likeOpacity, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
    Animated.spring(dislikeOpacity, {
      toValue: 1,
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
    if (isLoading) {
      return <Loading />;
    }
    if (currentIndex >= poke.length) {
      return <Text>No more Pokémon to show!</Text>;
    }
    return poke.map((p, index) => {
      if (index === currentIndex) {
        // Vérifier si le pokémon est déjà liké
        const isLiked = localStorage[STORAGE_NAME] && JSON.parse(localStorage[STORAGE_NAME])[p.id] !== undefined;
        if (isLiked) {
          // Passer au pokémon suivant
          if (currentIndex == poke.length - 2) getPoke();
          setCurrentIndex(currentIndex + 1);
          return null;
        }
        return (
          <Animated.View
            {...panResponder.panHandlers}
            key={p.name}
            style={[styles.cardContainer,
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
              type={p.types[0].type.name}
            />
          </Animated.View>
        );
      }
      return null;
    });
  };



  return (
    <View style={styles.container}>
      <View style={styles.swipeContainer}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#111',
    alignItems: 'center',
    justifyContent: 'center',
  },
  swipeContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'space-around',
    padding: 16,
    width: 400,
    maxWidth: "100%",
  },
  cardContainer: {
    height: '80%',
    alignItems: 'center',
    justifyContent: 'center'
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
