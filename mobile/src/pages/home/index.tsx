import React, {useState, useEffect} from 'react';

import { useNavigation } from '@react-navigation/native';
import { View, Image, ImageBackground, StyleSheet, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';

import { Feather as Icon } from '@expo/vector-icons';

import PickerSelect from 'react-native-picker-select';

import axios from 'axios';

interface IBGEUFResponse{
  sigla: string;
}

interface IBGECityResponse{
  nome: string;
}

const Home = () => {

    const navigation = useNavigation();

    const [uf, setUf] = useState('');
    const [city, setCity] = useState('');

    const [ufList, setUfList] = useState<string[]>([]);
    const [citylist, setCityList] = useState<string[]>([]);

    useEffect(() => {
      axios.get<IBGEUFResponse[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
        .then(response => {
          const ufs = response.data.map(uf => uf.sigla);

          setUfList(ufs);
        });
    }, []);

    useEffect(() => {
      axios.get<IBGECityResponse[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${uf}/municipios`)
        .then(response => {
          const cities = response.data.map(city => city.nome);

          setCityList(cities);
        });
    }, [uf]);

    function handleNavigationToPoints(){
        navigation.navigate('Points', {
          uf,
          city
        });
    }

    return (
      <KeyboardAvoidingView style={{flex: 1}} behavior={Platform.OS === 'ios' ? 'padding': undefined}>
        <ImageBackground
            source={require('../../assets/home-background.png')}
            style={styles.container}
            imageStyle={{ width: 274, height: 368 }}>

            <View style={styles.main}>
              <Image source={require('../../assets/logo.png')} />
              <View>
                <Text style={styles.title}>
                    Seu marketplace de coleta de residuos
                </Text>
                <Text style={styles.description}>
                    Ajudamos pessoas a encontrarem pontos de coleta de forma eficiente.
                </Text>
              </View>
            </View>

            <View style={styles.footer}>

              <PickerSelect
                  items={ ufList.map(uf => {
                    return { value: uf, label: uf, key: String(uf) }
                  }) }
                onValueChange={ value => setUf(value) }
                style={
                  { viewContainer: {
                      backgroundColor: '#fff',
                      borderRadius: 10,
                      marginBottom: 10
                    },
                    placeholder: {
                      color: '#000'
                    }
                  }
                } />

              <PickerSelect
                items={ citylist.map(city => {
                  return { value: city, label: city, key: String(city) }
                }) }
                onValueChange={ value => setCity(value) }
                style={
                  { viewContainer: {
                      backgroundColor: '#fff',
                      borderRadius: 10,
                      marginBottom: 10
                    },
                    placeholder: {
                      color: '#000'
                    }
                  }
                } />

              <RectButton style={styles.button} onPress={handleNavigationToPoints}>
                  <View style={styles.buttonIcon}>
                      <Text>
                          <Icon name="arrow-right" color="#fff" size={24} />
                      </Text>
                  </View>
                  <Text style={styles.buttonText}>Entrar</Text>
              </RectButton>

            </View>

        </ImageBackground>
      </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 32
      },
    
      main: {
        flex: 1,
        justifyContent: 'center',
      },
    
      title: {
        color: '#322153',
        fontSize: 32,
        fontFamily: 'Ubuntu_700Bold',
        maxWidth: 260,
        marginTop: 64,
      },
    
      description: {
        color: '#6C6C80',
        fontSize: 16,
        marginTop: 16,
        fontFamily: 'Roboto_400Regular',
        maxWidth: 260,
        lineHeight: 24,
      },
    
      footer: {},
    
      select: {},
    
      input: {
        height: 60,
        backgroundColor: '#FFF',
        borderRadius: 10,
        marginBottom: 8,
        paddingHorizontal: 24,
        fontSize: 16,
      },
    
      button: {
        backgroundColor: '#34CB79',
        height: 60,
        flexDirection: 'row',
        borderRadius: 10,
        overflow: 'hidden',
        alignItems: 'center',
        marginTop: 8,
      },
    
      buttonIcon: {
        height: 60,
        width: 60,
        backgroundColor: 'rgba(0, 0, 0, 0.1)',
        justifyContent: 'center',
        alignItems: 'center'
      },
    
      buttonText: {
        flex: 1,
        justifyContent: 'center',
        textAlign: 'center',
        color: '#FFF',
        fontFamily: 'Roboto_500Medium',
        fontSize: 16,
      },
});

export default Home;