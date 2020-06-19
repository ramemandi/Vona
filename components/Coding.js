import *as React from 'react';
import {View,Text,StyleSheet,Alert} from 'react-native';
  
class Coding extends React.Component {
    testArray =[100,100,100,100,102,100];
    leftOne= null;
    constructor(props){
        super(props);
        this.state = {
            codeArray : this.testArray,
            oddOne : null
         } 
    }
    UNSAFE_componentWillMount(){
        this.divideNconquer();
    }

    displayArray(){
       
    return (  <View style={{flexDirection:'row'}}>
            {this.state.codeArray.map((value,index)=>{
                // console.log(value,index);
                return (  <Text key={index}>  {value} </Text> )
            })
             }
               <Text key={this.leftOne}>  {this.leftOne} </Text>
        </View> 
    ) }

    divideNconquer(){
        console.log(this.testArray.length) 
        if(this.testArray.length % 2 === 0){

        }else {
         this.leftOne = this.testArray.pop();
        }
        // this.testArray.re
        let halfArray = (this.testArray.length/2);
        console.log(this.testArray.slice(0,halfArray));
        let subArray1 = this.testArray.slice(0,halfArray);
        let subArray2 = this.testArray.slice(halfArray,this.testArray.length);
        let sum1= subArray1.reduce((prev,next)=>{
            return prev+next;
        });
        let sum2= subArray2.reduce((prev,next)=>{
            return prev+next;
        })
        // let sum2= sum1;
        // Alert.alert('test')
        console.log(sum2,'sum2');
        console.log(sum1,'sum1');
        (sum1 > sum2)? this.filter1(subArray1): this.filter1(subArray2);
    }
    filter1(filteredArray){
        // Alert.alert('filter1');
        let high= 0;
        let low = 0;
        let sortNow = filteredArray.sort();
        if(sortNow.length == 2){
            let result = (this.testArray.filter((oddOne)=> oddOne == sortNow[0]));
         //    Alert.alert(low)
             if(result.length > 1){
                 // Alert.alert('string')
                 this.setState({oddOne:sortNow[1]});
             }else {
                 this.setState({oddOne:sortNow[0]});
             }
        }else {
            let sum1= sortNow.reduce((prev,next)=>{
                console.log(prev,next);
                if(prev != next ){
                    console.log(prev,'prev',next,'next');
                    console.log(filteredArray,'filteredArray');
                       low = prev;
                       high = next; 
                    let result = (filteredArray.filter((oddOne)=> oddOne == low));
                   console.log( result.length,'LEGTH');
                   console.log( low, high ,'low high ');
                   console.log( typeof(low));
                //    Alert.alert(low)
                    if(result.length > 1){
                        // Alert.alert('string')
                        this.setState({oddOne:high});
                    }else {
                        this.setState({oddOne:low});
                    }
                    // console.log(result)
                    // let result1 = ((filteredArray.filter((oddOne)=> oddOne == high)));
                    // console.log(result1.length) 
                } 
                if((prev == next) && (prev != this.leftOne && next != this.leftOne) ){
                        this.setState({oddOne:this.leftOne})
                }
                 
                return prev;
            });
        }
        
    }
    render(){
      return  <View style={styles.panel}>
                {this.displayArray()} 
                <Text>{this.state.oddOne}</Text>
        </View>
    }
}

var styles = StyleSheet.create({
    panel :{
        flex:1,
        justifyContent:"center",
        alignItems:'center',
        padding:30
    }
}) 

export default Coding;