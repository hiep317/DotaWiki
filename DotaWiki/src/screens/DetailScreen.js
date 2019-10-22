import React from 'react'
import {View, Dimensions, ScrollView, StyleSheet, Image, ActivityIndicator, Text, SafeAreaView} from 'react-native'
import { Table, Row, Rows, Col, Cols, Cell } from 'react-native-table-component'

const FixedStats = (data) => {
  var stats = {
    tableData: [],
  };
  for (item of data.fixStats) {
    stats.tableData.push([item.name, item.value]);
  }
  return stats;
}

const StatsOnLevel = (data) => {
  var stats = {
    tableHead: ['Level', 'Base', '1', '15', '25'],
    tableData: [],
  };
  // Values
  for (var i = 0; i < data.statsOnLevel[0].stats.length; i++) {
    tblData = [];
    var j = 0;
    for (let item of data.statsOnLevel) {
      if (j == 0) {
        tblData.push(item.stats[i].name);
      }
      tblData.push(item.stats[i].value);
      j++;
    }
    stats.tableData.push(tblData);
  }
  for (item of data.fixStats) {
    stats.tableData.push([item.name, item.value]);
  }
  return stats;
};

const AttributeView = ({attributeData}) => {
    var tableData = [];
    var icons = [];
    var values = [];
    var primary = [];
    for (let item of attributeData.attributes) {
      icons.push(<Image source={{uri:item.icon}} style={styles.attributeImage} />);
      values.push(item.value);
      primary.push(item.isPrimary ? "(Primary)" : "")
    }

    tableData.push(icons, values, primary)

  return <Table style={styles.attributeTable} borderStyle={{borderWidth: 0}}>
            <Rows data={tableData} textStyle={styles.attributeText} style={styles.attributeRow}/>
          </Table>
}

const SkillView = ({data}) => {
  var allSkills = [];

  for (var skill of data.skills) {
    var skillData = {
      tableHead: [],
      tableData: [],
    };

    skillData.tableHead = [skill.name];
    skillData.tableData.push([<Image source={{uri:skill.iconUrl}} style={styles.attributeImage} />]);
    var typeKeys = [];
    var typeValues = [];
    for (var type of skill.types) {
      typeKeys.push(type.key);
      typeValues.push(type.value);
    }
    
    skillData.tableData.push(typeKeys);
    skillData.tableData.push(typeValues);
    skillData.tableData.push([skill.description]);

    for (item of skill.detail) {
      if (item.name != undefined) {
        skillData.tableData.push([item.name, item.value]);
      } else if (item.icon != undefined) {
        skillData.tableData.push([<Image source={{uri:item.icon}} style={styles.iconImage} />, item.value]);
      }
    }

    allSkills.push(skillData)
  }

  return allSkills.map(function(skill, index) {
    return (
      <Table key={index} style={styles.skillTable} borderStyle={{borderLeftWidth: 0, borderBottomWidth: 1, borderColor: '#c8e1ff'}}>
        <Row data={skill.tableHead} textStyle={styles.skillTextHead} style={styles.head}/>
        <Rows data={skill.tableData} textStyle={styles.skillText} style={styles.attributeRow}/>
      </Table>
    )
  })       
}

const TalentView = ({data}) => {
  var talentData = {
    tableHead: ["Hero Talents"],
    tableData: []
  }

  for (var item of data.talents) {
    talentData.tableData.push([item.leftTalent.text, item.level,item.rightTalent.text]);
  }

  return (
    <Table style={styles.skillTable} borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
      <Row data={talentData.tableHead} textStyle={styles.skillTextHead} style={styles.head}/>
      <Rows data={talentData.tableData} textStyle={{alignSelf: 'center'}} style={styles.attributeRow}/>
    </Table>
  )
}


class DetailScreen extends React.Component {
    static navigationOptions = ({ navigation, navigationOptions }) => {
        return {
          title: navigation.getParam('heroName', 'Hero information'),
          headerStyle: {
            backgroundColor: navigationOptions.headerTintColor,
          },
          headerTintColor: navigationOptions.headerStyle.backgroundColor,
        };
      };

      constructor(props){
        super(props);
        this.state = { isLoading: true }
      }

      componentDidMount(){
        const { navigation } = this.props;
        return fetch('https://dota2-wiki.herokuapp.com/api/heros/' + navigation.getParam('heroId'))
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



    screenWidth = Math.round(Dimensions.get('window').width)

    render() {
        const { navigation } = this.props;
        var {dataSource} = this.state;
        if(this.state.isLoading){
          return(
            <View style={{flex: 1, padding: 20}}>
              <ActivityIndicator/>
            </View>
          );
        }

        return (
        <SafeAreaView style={{flex: 1}}>
          <ScrollView style={styles.container}>
            <Image source={{uri:dataSource.avatarUrl}} style={{width: this.screenWidth - 20, height:240}} />
            <AttributeView  attributeData={dataSource}/>
            <Table borderStyle={{borderWidth: 1, borderColor: '#c8e1ff'}}>
              <Row data={StatsOnLevel(dataSource).tableHead} style={styles.head} textStyle={styles.text}/>
              <Rows data={StatsOnLevel(dataSource).tableData} textStyle={styles.text}/>
            </Table>
            <SkillView data={dataSource} />
            <TalentView data={dataSource} />
          </ScrollView>
        </SafeAreaView>
      );
    }
  }

  const styles = StyleSheet.create({
    container: { flex: 1, padding: 10, backgroundColor: '#fff',},
    head: { height: 40, backgroundColor: '#f1f8ff',},
    text: { margin: 6, color: '#454545', textAlign: "center" },

    attributeTable: {
      flex: 1,
      backgroundColor: '#f4511e',
    },
    attributeText: {
      color: '#fff',
      textAlign: "center"
    },
    attributeRow: {
      flex: 1,
      alignItems:'center',
      paddingBottom: 4,
    },
    attributeImage: {
      width: 44,
      height: 44,
      alignSelf:'center',
    },
    iconImage: {
      width: 16,
      height: 16,
      alignSelf:"flex-end",
    },
    skillTable: {
      flex: 1,
      backgroundColor: '#fff',
    },
    skillTextHead: {
      color: '#454545',
      fontWeight: 'bold',
      alignSelf: "center"
    },
    skillText: {
      color: '#454545',
    },
  });

export default DetailScreen;