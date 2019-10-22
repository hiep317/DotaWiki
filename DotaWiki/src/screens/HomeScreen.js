import React from 'react'
import {View, Text, ScrollView, StyleSheet, Image, Switch, ActivityIndicator, TextInput, Dimensions} from 'react-native'
import { Cell, Section, TableView } from 'react-native-tableview-simple';

const sectionData = [
  'Heroes',
];

class HomeScreen extends React.Component {
  static navigationOptions = {
    title: 'Heroes',
  };

  constructor(props){
    super(props);
    this.state ={ isLoading: true, dataSource: []}
  }


  componentDidMount(){
    return fetch('https://dota2-wiki.herokuapp.com/api/heros')
      .then((response) => response.json())
      .then((responseJson) => {
        this.setState({
          isLoading: false,
          dataSource: responseJson.data,
        }, function(){
            
        });

      })
      .catch((error) =>{
        console.error(error);
      });
  }

  render() {
    const { navigate } = this.props.navigation;
    var dataSource = this.state.dataSource;

    if(this.state.isLoading){
      return(
        <View style={{flex: 1, padding: 20}}>
          <ActivityIndicator/>
        </View>
      );
    }

    return (
    <ScrollView contentContainerStyle={styles.stage}>
            <TableView>
              { sectionData.map( function(sectionName, index) {
                return (
                  <Section key={sectionName} header={sectionName}>
                  {
                      dataSource.map(function(heroData, index) {
                        return (
                          <Cell
                            key = {heroData.id}
                            cellStyle="Basic"
                            title={heroData.name}
                            accessory="DisclosureIndicator"
                            onPress={() => navigate('Detail', {heroName: heroData.name, heroId: heroData.id})}
                            image={
                              <Image
                                style={{ borderRadius: 5 }}
                                source={{
                                  uri: heroData.avatarUrl,
                                }}
                              />
                            }
                          />
                        )
                      }
                      )
                  }
                  </Section>
                )
                }
              )}
            </TableView>
          </ScrollView>
    );
  }    
}

const styles = StyleSheet.create({
  stage: {
    backgroundColor: '#EFEFF4',
    paddingTop: 20,
    paddingBottom: 20,
  },
});

export default HomeScreen;