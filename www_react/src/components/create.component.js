import React, { Component } from 'react';
import axios from 'axios';
import md5 from 'crypto-js/md5';
import QuirkTableRow from './QuirkTableRow';
import FlawsTableRow from './FlawsTableRow';
import MagickaTableRow from './MagickaTableRow';
import WeaponTableRow from './WeaponTableRow';
import ArmorTableRow from './ArmorTableRow';
import HorseTableRow from './HorseTableRow';
import EmptyTableRow from './EmptyTableRow';
import SpecialtyTableRow from './SpecialtyTableRow';
import Select from 'react-select';

import aspectsJSON from '../json/aspects';
import aptitudesJSON from '../json/aptitudes';


const makeID = () => {
  // var hash = md5(new Date().valueOf() + Math.random()).toString();
  var date = new Date().valueOf();
  var rnd = Math.random();
  var hash = md5((date + rnd).toString());
  var hashStr = hash.toString();
  console.log("md5 hash:", hash, hashStr, rnd, date);
  return hashStr.substr(-8);
}

const sectionsHeight = 170; //em
const emCalc = {
  perLine: 45,
  perProp: 4
};

const initialState = {
  name: '',
  owner: '',
  id: makeID(),
  concept: '',
  virtue: '',
  vice: '',
  racial: '',
  description: '',
  physical: 0,
  mental: 0,
  social: 0,
  aspect_physical_msg: '',
  aspect_mental_msg: '',
  aspect_social_msg: '',
  aptitude_total: 20,
  intelligence: 1,
  wits: 1,
  resolve: 1,
  strength: 1,
  dexterity: 1,
  stamina: 1,
  presence: 1,
  manipulation: 1,
  composure: 1,
  fisticuffs: 0,
  melee: 0,
  ranged: 0,
  thaumatism: 0,
  athletics: 0,
  crafts: 0,
  culture: 0,
  empathy: 0,
  expression: 0,
  intimidation: 0,
  investigation: 0,
  larceny: 0,
  luck: 1,
  arcanaforn: 0,
  medicine: 0,
  observation: 1,
  persuasion: 0,
  portaelogy: 1,
  riding: 0,
  stealth: 0,
  streetwise: 0,
  subterfuge: 0,
  survival: 0,
  technika: 0,
  astrylose: 0,
  willpower: 0,
  vitality: 0,
  size: 5,
  speed: 0,
  initiative: 0,
  defense: 0,
  starting_xp: 15,
  available_xp: 15,
  quirk: '',
  quirkTotalCost: "",
  hasQuirk: [],
  flaws: '',
  flawsTotalCost: "",
  hasFlaws: [],
  magicka: '',
  magickaTotalCost: "",
  hasMagicka: [],
  weapon: '',
  weaponTotalCost: "",
  weaponChildrenCost: "",
  hasWeapon: [],
  hasWeaponChildren: [],
  armor: '',
  armorTotalCost: "",
  hasArmor: [],
  horse: '',
  horseTotalCost: "",
  hasHorse: [],
  empty: '',
  hasEmpty: [],
  specialtyFirst: '',
  specialtySecond: '',
  specialtyTotalCost: "",
  hasSpecialty: [],
  extrasOverflow: sectionsHeight,
  quirkOverflow: 0,
  flawsOverflow: 0,
  magickaOverflow: 0,
  weaponOverflow: 0,
  armorOverflow: 0,
  horseOverflow: 0,
  specialtyOverflow: 0,
  emptyOverflow: 0,
  xpFromPlayer: 0,
  xpFromCampaign: 0,
  xpFromCampaignObjs: []
};

const physicalAspects = ["strength", "dexterity", "stamina"];
const mentalAspects = ["intelligence", "wits", "resolve"];
const socialAspects = ["presence", "manipulation", "composure"];
const allAspects = [...physicalAspects, ...mentalAspects, ...socialAspects];

const combatAptitudes = ["fisticuffs", "melee", "ranged", "thaumatism"];
const nonCombatAptitudes = ["arcanaforn","athletics","crafts","culture","empathy","expression","intimidation","investigation","larceny","luck","medicine","observation","persuasion","portaelogy","riding","stealth","streetwise","subterfuge","survival","technika"];
const allAptitudes = [...combatAptitudes, ...nonCombatAptitudes];

const allStats = [...allAspects, ...allAptitudes];

const extrasList = [ "quirk", "flaws", "magicka", "weapon", "armor", "horse", "empty", "specialty"];



export default class Create extends Component {
  constructor(props) {
    super(props);
    this.myRef = React.createRef();
    this.clearState = this.clearState.bind(this);
    this.checkComponent = this.checkComponent.bind(this);
    this.checkIfComponent = this.checkIfComponent.bind(this);
    this.checkXP = this.checkXP.bind(this);
    this.checkEditAspectAndAptitude = this.checkEditAspectAndAptitude.bind(this);
    this.checkAspects = this.checkAspects.bind(this);
    this.checkAptitudes = this.checkAptitudes.bind(this);
    this.checkCompositeStats = this.checkCompositeStats.bind(this);
    this.onChangeName = this.onChangeName.bind(this);
    this.onChangeOwner = this.onChangeOwner.bind(this);
    this.onChangeConcept = this.onChangeConcept.bind(this);
    this.onChangeVirtue = this.onChangeVirtue.bind(this);
    this.onChangeVice = this.onChangeVice.bind(this);
    this.onChangeRacial = this.onChangeRacial.bind(this);
    this.onChangeDescription = this.onChangeDescription.bind(this);
    this.onChangeAspectAndAptitude = this.onChangeAspectAndAptitude.bind(this);
    this.onChangeNothing = this.onChangeNothing.bind(this);

    this.onChangeXPFromCampaign = this.onChangeXPFromCampaign.bind(this);
    
    this.onChangeSize = this.onChangeSize.bind(this);

    this.onChangeQuirk = this.onChangeQuirk.bind(this);
    this.onQuirkSubmit = this.onQuirkSubmit.bind(this);
    this.quirkSetter = this.quirkSetter.bind(this);
    
    this.onChangeFlaws = this.onChangeFlaws.bind(this);
    this.flawsSetter = this.flawsSetter.bind(this);
    this.onFlawsSubmit = this.onFlawsSubmit.bind(this);
    
    this.onChangeMagicka = this.onChangeMagicka.bind(this);
    this.magickaSetter = this.magickaSetter.bind(this);
    this.onMagickaSubmit = this.onMagickaSubmit.bind(this);
    
    this.onChangeWeapon = this.onChangeWeapon.bind(this);
    this.weaponSetter = this.weaponSetter.bind(this);
    this.onWeaponSubmit = this.onWeaponSubmit.bind(this);
    
    this.onChangeArmor = this.onChangeArmor.bind(this);
    this.armorSetter = this.armorSetter.bind(this);
    this.onArmorSubmit = this.onArmorSubmit.bind(this);
    
    this.onChangeHorse = this.onChangeHorse.bind(this);
    this.horseSetter = this.horseSetter.bind(this);
    this.onHorseSubmit = this.onHorseSubmit.bind(this);

    this.onChangeEmpty = this.onChangeEmpty.bind(this);
    this.emptySetter = this.emptySetter.bind(this);
    this.onEmptySubmit = this.onEmptySubmit.bind(this);

    this.onChangeFirstSpecialty = this.onChangeFirstSpecialty.bind(this);
    this.onChangeSecondSpecialty = this.onChangeSecondSpecialty.bind(this);
    this.specialtySetter = this.specialtySetter.bind(this);
    this.onSpecialtySubmit = this.onSpecialtySubmit.bind(this);


    this.onSubmit = this.onSubmit.bind(this);
    this.undoClearAndRefresh = this.undoClearAndRefresh.bind(this);
    this.onRefreshFromDB = this.onRefreshFromDB.bind(this);
    this.toggleStatDescHidden = this.toggleStatDescHidden.bind(this);
    this.mainStat = this.mainStat.bind(this);
    this.displayStatArray = this.displayStatArray.bind(this);
    this.codaDisplayAndSelect = this.codaDisplayAndSelect.bind(this);
    this.displayUpdateSubmitButton = this.displayUpdateSubmitButton.bind(this);
    this.arrayToSelectOptions = this.arrayToSelectOptions.bind(this);

    this.compare = this.compare.bind(this);
    this.compareInverted = this.compareInverted.bind(this);


    this.state = initialState;
    Object.assign(this.state, {
      whichComponent: ''
    });

  }

  compare(a, b) {
    // Use toUpperCase() to ignore character casing
    const bandA = a.cost;
    const bandB = b.cost;

    let comparison = 0;
    if (bandA > bandB) {comparison = 1;} 
    else if (bandA < bandB) {comparison = -1;}
    return comparison;
  }
  compareInverted(a, b) {
    let comparison = 0;
    if (a.cost > b.cost) {comparison = -1;} 
    else if (a.cost < b.cost) {comparison = 1;}
    return comparison;
  }

  checkComponent(){
    var cmp = this.checkIfComponent();
    if(!this.state.whichComponent.includes(cmp)){
      console.log("Not matching components, will update state", this.state.whichComponent,cmp);
      this.setState({
        whichComponent: cmp
      }, () => {
        if(cmp.includes("Create")){this.clearState();}
      });
    }
    return cmp;
  }


  checkIfComponent(tmp = ""){
    var editID = this.props.match.params.id;
    var cmp = "";
    if(editID && editID.length){
      cmp = "Edit";
    }else{
      cmp = "Create"
    }

    if(tmp && tmp.length > 0){
      if(tmp.includes(cmp)){
        return true;
      }else{
        return false;
      }
    }else{
      return cmp;
    }
    
  }

  clearState(){
    this.setState(initialState, () => {
      console.log("this.state cleared!", this.state);
    });
  }


  checkOverflow(){
    var largest = 0;
    extrasList.forEach(extra => {
      if(extra.includes("quirk") || extra.includes("flaws")){
        largest = Math.max( largest, sectionsHeight, 2 * parseInt(this.state[extra+"Overflow"]));
      }else{
        largest = Math.max( largest, sectionsHeight, parseInt(this.state[extra+"Overflow"]));
      }
    });
    this.setState({
        extrasOverflow: largest
      }, () => {
        // console.log("setState extrasOverflow: overflow", this.state.extrasOverflow, sectionsHeight, largest);
      });
  }

  showXP(){
    var showXP = this.state.available_xp;
    // console.log("create checkXP availableXP:", availableXP);

    showXP -= this.state.quirkTotalCost;
    showXP -= Math.max(-15, this.state.flawsTotalCost);
    showXP -= this.state.magickaTotalCost;
    showXP -= this.state.weaponTotalCost;
    showXP -= this.state.weaponChildrenCost;
    showXP -= this.state.armorTotalCost;
    showXP -= this.state.horseTotalCost;
    showXP -= this.state.specialtyTotalCost;

    // console.log("create checkXP after extras availableXP:", availableXP);

    if(this.state.xpFromPlayer){showXP += this.state.xpFromPlayer;}
    if(this.state.xpFromCampaign){showXP += this.state.xpFromCampaign;}

    // console.log("create checkXP after campaing/player XP availableXP:", availableXP);
    return showXP;
  }


  checkXP(array){
    var availableXP = 0;

    var editID = this.props.match.params.id;
    if(editID && editID.length){
      availableXP = this.state.available_xp;
    }else{ // Create!
      availableXP = this.state.starting_xp;
      var array = [{key: 'physical', value: this.state.physical}, 
          {key: 'mental', value: this.state.mental}, 
          {key: 'social', value: this.state.social} 
          ];
      array.sort(function(obj1, obj2) {
        return obj1.value - obj2.value;
      });
      var arrayPhysical = [{key: 'strength', value: this.state.strength}, 
            {key: 'dexterity', value: this.state.dexterity}, 
            {key: 'stamina', value: this.state.stamina} 
            ];
      arrayPhysical.sort(function(obj1, obj2) {
       return obj1.value - obj2.value;
      });
      var lowestPhysical = arrayPhysical[0].value;
        var arrayMental = [{key: 'intelligence', value: this.state.intelligence}, 
              {key: 'wits', value: this.state.wits}, 
              {key: 'resolve', value: this.state.resolve} 
              ];
        arrayMental.sort(function(obj1, obj2) {
         return obj1.value - obj2.value;
      });
      var lowestMental = arrayMental[0].value;
        var arraySocial = [{key: 'presence', value: this.state.strength}, 
              {key: 'manipulation', value: this.state.mental}, 
              {key: 'composure', value: this.state.composure} 
              ];
        arraySocial.sort(function(obj1, obj2) {
         return obj1.value - obj2.value;
      });
      var lowestSocial = arraySocial[0].value;

      var cycle = 0;
      for(cycle=0;cycle<3;cycle++){
        var allowed = cycle+3;
        var cycleKey = array[cycle].key;
        var cycleValue = array[cycle].value;
        var diff = cycleValue - allowed;

        console.log(cycle, cycleKey, cycleValue, "|", diff, "|" , lowestPhysical, lowestMental, lowestSocial);

        var adjustment=0;
        if(cycleValue > allowed){
          if(cycleKey === "physical"){adjustment = lowestPhysical*5*diff}
          if(cycleKey === "mental"){adjustment = lowestMental*5*diff}
          if(cycleKey === "social"){adjustment = lowestSocial*5*diff}
        }
        if(adjustment == 5){adjustment = 10;}
        availableXP -= adjustment;
      }

      var aptitudeOverage = 0;
      if(this.state.aptitude_total < 0){aptitudeOverage = 3 * this.state.aptitude_total}
      availableXP += aptitudeOverage;

      this.setState({available_xp: availableXP});

    }

    
    

    // last line
  }

  checkAspects(){
    this.setState({
      physical: parseInt(this.state.strength)  + parseInt(this.state.dexterity)  + parseInt(this.state.stamina) -3, 
      mental: parseInt(this.state.intelligence)  + parseInt(this.state.wits)  + parseInt(this.state.resolve) -3, 
      social: parseInt(this.state.presence)  + parseInt(this.state.manipulation)  + parseInt(this.state.composure) -3
    }, () => {
      var array = [{key: 'physical', value: this.state.physical}, 
            {key: 'mental', value: this.state.mental}, 
            {key: 'social', value: this.state.social} 
            ];
      array.sort(function(obj1, obj2) {
       return obj1.value - obj2.value;
    });
    // console.log("smallest element? ", array[0].key, array[0].value, );
    // console.log("mid element? ", array[1].key, array[1].value, );
    // console.log("largest element? ", array[2].key, array[2].value, );
    var largest = "aspect_"+array[2].key+"_msg";
    var mid = "aspect_"+array[1].key+"_msg";
    var smallest = "aspect_"+array[0].key+"_msg";

    if(array[2].value == 5){
      this.setState({[largest]: "Largest is "+array[2].key+" and at 5."});
    }else if (array[2].value > 5){
      this.setState({[largest]: "Largest is "+array[2].key+" and is above 5. This will incur XP cost or maybe need reworking."});
    }else{ // less than 5
      this.setState({[largest]: "Largest is "+array[2].key+" and the allowed amount (5). Feel free to add "+(5-array[2].value)+" more dots!"});
    }

    if(array[1].value == 4){
      this.setState({[mid]: "Mid is "+array[1].key+" and at 4."});
    }else if (array[1].value > 4){
      this.setState({[mid]: "Mid is "+array[1].key+" and is above 4. This will incur XP cost or maybe need reworking."});
    }else{ // less than 4
      this.setState({[mid]: "Mid is "+array[1].key+" and the allowed amount (4). Feel free to add "+(4-array[1].value)+" more dots!"});
    }

    if(array[0].value == 3){
      this.setState({[smallest]: "Smallest is "+array[0].key+" and at 3."});
    }else if (array[0].value > 3){
      this.setState({[smallest]: "Smallest is "+array[0].key+" and is above 3. This will incur XP cost or maybe need reworking."});
    }else{ // less than 3
      this.setState({[smallest]: "Smallest is "+array[0].key+" and the allowed amount (3). Feel free to add "+(3-array[0].value)+" more dots!"});
    }

    this.checkXP();

  });
  }

  checkAptitudes(){
    var aptitudeTally = 0;
    allAptitudes.forEach(aptitude => {
      aptitudeTally += parseInt(this.state[aptitude]);
    });
    this.setState({
      aptitude_total: 23 - aptitudeTally
    }, () => {
      this.checkXP();
  });
  }


  checkEditAspectAndAptitude(changed, val, isAspect=false){
    var preVal = this.state[changed];
    var cost = 0;
    var mult = 3;
    if(isAspect){mult=5;}
    if(val > preVal){
      for(var i = preVal + 1; i <= val;i++){
        cost -= i * mult;
      }
      this.setState({
        [changed]: parseInt(val),
        available_xp: parseInt(cost) + parseInt(this.state.available_xp)
      }, () => {
        // console.log("updated changed state", cost, this.state.available_xp, preVal, val);
        if(isAspect){
          this.checkCompositeStats(changed, val);
        }
      });
    }else{
      //update state, but only back to org value
      this.setState({
        [changed]: parseInt(this.state[changed])
      }, () => {
        // console.log("didnt update changed state", cost, this.state.available_xp, preVal, val);
      });
    }
  }

  checkCompositeStats(changed, val){
    var obj = {}
    if(changed.includes("wits")){
      var defense = Math.min(val , this.state.dexterity);
      obj.defense = defense;
    }
    if(changed.includes("dexterity")){
      var defense = Math.min(val , this.state.wits);
      obj.defense = defense;
    }
    if(changed.includes("resolve")){
      var astrylose = parseInt(val) + parseInt(this.state.size);
      var willpower = parseInt(val) + parseInt(this.state.composure);
      obj.astrylose = astrylose;
      obj.willpower = willpower;
    }
    if(changed.includes("strength")){
      var speed = parseInt(val) + parseInt(this.state.dexterity) + parseInt(this.state.size);
      obj.speed = speed;
    }
    if(changed.includes("dexterity")){
      var speed = parseInt(val) + parseInt(this.state.strength) + parseInt(this.state.size);
      var initiative = parseInt(val) + parseInt(this.state.composure);
      var defense = Math.min(val , this.state.wits);
      obj.speed = speed;
      obj.initiative = initiative;
      obj.defense = defense;
    }
    if(changed.includes("stamina")){
      var vitality = parseInt(val) + parseInt(this.state.size);
      obj.vitality = vitality;
    }
    if(changed.includes("composure")){
      var willpower = parseInt(val) + parseInt(this.state.resolve);
      var initiative = parseInt(val) + parseInt(this.state.dexterity);
      obj.willpower = willpower;
      obj.initiative = initiative;
    }

    // finally
    this.setState(obj, () => {
      // console.log("updated composites for", obj, this.state);
    });
  }

  onChangeNothing(e) {
    // do nothing
  }
  onChangeName(e) {
    this.setState({
      name: e.target.value
    });
  }
  onChangeOwner (e) {
    var val="";
    try {
      val = this.props.user.getEmail();
    }
    catch(err) {
      console.log(err);
    }
    this.setState({
      owner: val
    }) 
  }
  onChangeConcept(e) {
    // console.log("onChangeConcept", e.currentTarget);
    this.setState({
      concept: e.target.value
    });
  }
  onChangeVirtue(e) {
    this.setState({
      virtue: e.target.value
    });
  }
  onChangeVice(e) {
    this.setState({
      vice: e.target.value
    });
  }
  onChangeRacial(e) {
    this.setState({
      racial: e.target.value
    });
  }
  onChangeDescription(e) {
    this.setState({
      description: e.target.value
    });
  }
  onChangeAspectAndAptitude(changed, e, isAspect=false) {
    const theVal = parseInt(e.target.value);
    console.log("onChangeAspectAndAptitude", changed, e.target.value, theVal, isAspect);
    if(changed.stat){changed = changed.stat;}
    if(this.checkIfComponent("Edit")){
      this.checkEditAspectAndAptitude(changed, theVal, isAspect);
    }else{// its Create
      this.setState({
        [changed]: theVal
      }, () => {
        if(isAspect){
          this.checkCompositeStats(changed, theVal);
          this.checkAspects();
        }else{
          this.checkAptitudes();
        }
        
      });
    }
    
  }  

  onChangeSize(e) {
    this.setState({
      size: e.target.value,
      astrylose: parseInt(e.target.value) + parseInt(this.state.resolve),
      speed: parseInt(e.target.value) + parseInt(this.state.dexterity) + parseInt(this.state.strength)
    });
  }

  onChangeQuirk(e) {
    console.log("onChangeQuirk:", e);
    this.setState({ quirk: e.value });
  }
  onChangeFlaws(e) {
    console.log("onChangeFlaws:", e);
    this.setState({ flaws: e.value });
  }
  onChangeMagicka(e) {
    console.log("onChangeMagicka:", e);
    this.setState({ magicka: e.value });
  }
  onChangeWeapon(e) {
    console.log("onChangeWeapon:", e);
    this.setState({ weapon: e.value });
  }
  onChangeArmor(e) {
    console.log("onChangeArmor:", e);
    this.setState({ armor: e.value });
  }
  onChangeHorse(e) {
    console.log("onChangeHorse:", e);
    this.setState({ horse: e.value });
  }
  onChangeFirstSpecialty(e) {
    console.log("onChangeFirstSpecialty:", e);
    this.setState({ specialtyFirst: e.value });
  }
  onChangeSecondSpecialty(e) {
    console.log("onChangeSecondSpecialty:", e);
    this.setState({ specialtySecond: e.value });
  }

  onChangeEmpty(e) {
    this.setState({
      empty: e.target.value
    });
  }

  onChangeXPFromCampaign(e) {
    console.log("onChangeXPFromCampaign:", e);
    this.setState({
      xpFromCampaign: e.value
    }, () => {
      // console.log("setState extrasOverflow: overflow", this.state.extrasOverflow, sectionsHeight, largest);
      // this.checkXP();
    });
  }

  onEmptySubmit(e) {
    e.preventDefault();
    var obj = {
      sheet: this.state.id,
      empty: this.state.empty
    };

    axios.defaults.baseURL = '';
    axios.post('/empty/add', obj, { baseUrl: "" })
        .then(res => console.log("Added empty:",res.data))
        .then(res => {
          console.log("getting emptys for sheet:", this.state.id);
          axios.get('/empty/'+this.state.id, { baseUrl: "" })
            .then(response => {
              this.emptySetter(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
        });
    
    this.setState({
      empty: '',
    });   
  }

  onSubmit(e) {
    e.preventDefault();
    var val="";
    try {
      val = this.props.user.getEmail();
    }
    catch(err) {
      console.log(err);
    }
    var obj = {
      name: this.state.name,
      owner: val,
      concept: this.state.concept,
      virtue: this.state.virtue,
      vice: this.state.vice,
      racial: this.state.racial,
      description: this.state.description,
      astrylose: this.state.astrylose,
      willpower: this.state.willpower,
      vitality: this.state.vitality,
      size: this.state.size,
      speed: this.state.speed,
      initiative: this.state.initiative,
      defense: this.state.defense,
      starting_xp: this.state.available_xp,
      available_xp: this.state.available_xp
    };
    allStats.forEach(val => {
      obj[val] = this.state[val];
    });

    var editID = this.props.match.params.id;
    axios.defaults.baseURL = '';
    if(editID && editID.length){
      console.log("In Edit, editID:",editID);
      axios.post('/sheet/update/'+this.props.match.params.id, obj, { baseUrl: "" })
          .then(res => console.log(res.data));
    }else{
      console.log("In Create, no editID found", editID);
      obj.id = this.state.id;
      axios.post('/sheet/add', obj, { baseUrl: "" })
            .then(res => console.log(res.data));
    }
    
    this.props.history.push('/index');  // either way, bounce to index
    
  }

  onQuirkSubmit(e) {
    e.preventDefault();

    const selectedQuirk = this.props.quirkArray[this.state.quirk];
    if(!selectedQuirk){return 1;}
    const obj = {
      sheet: this.state.id,
      name: selectedQuirk.name,
      cost: selectedQuirk.cost,
      desc: selectedQuirk.desc,
      prereq: selectedQuirk.prereq,
      benefit: selectedQuirk.benefit,
      aspects: selectedQuirk.aspects,
      aptitudes: selectedQuirk.aptitudes
    };
    axios.defaults.baseURL = '';
    axios.post('/quirk/add', obj, { baseUrl: "" })
        .then(res => console.log("Added quirk:",res.data))
        .then(res => {
          console.log("getting quirks for sheet:", this.state.id);
          axios.get('/quirk/'+this.state.id, { baseUrl: "" })
            .then(response => {
              this.quirkSetter(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
        });
    
    this.setState({
      quirk: '',
    });

  }

  onFlawsSubmit(e) {
    e.preventDefault();

    const selectedFlaws = this.props.flawsArray[this.state.flaws];
    if(!selectedFlaws){return 1;}
    const obj = {
      sheet: this.state.id,
      name: selectedFlaws.name,
      cost: selectedFlaws.cost,
      desc: selectedFlaws.desc,
      prereq: selectedFlaws.prereq,
      benefit: selectedFlaws.benefit,
      aspects: selectedFlaws.aspects,
      aptitudes: selectedFlaws.aptitudes
    };
    axios.defaults.baseURL = '';
    axios.post('/flaws/add', obj, { baseUrl: "" })
        .then(res => console.log("Added flaws:",res.data))
        .then(res => {
          console.log("getting flawss for sheet:", this.state.id);
          axios.get('/flaws/'+this.state.id, { baseUrl: "" })
            .then(response => {
              this.flawsSetter(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
        });
    
    this.setState({
      flaws: '',
    });

  }

  onMagickaSubmit(e) {
    e.preventDefault();

    const selectedMagicka = this.props.magickaArray[this.state.magicka];
    if(!selectedMagicka){return 1;}
    const obj = {
      sheet: this.state.id,
      name: selectedMagicka.name,
      cost: selectedMagicka.cost,
      desc: selectedMagicka.desc,
      armor: selectedMagicka.armor,
      penalty: selectedMagicka.penalty,
      damage: selectedMagicka.damage,
      ap: selectedMagicka.ap
    };
    axios.defaults.baseURL = '';
    axios.post('/magicka/add', obj, { baseUrl: "" })
        .then(res => console.log("Added magicka:",res.data))
        .then(res => {
          console.log("getting magickas for sheet:", this.state.id);
          axios.get('/magicka/'+this.state.id, { baseUrl: "" })
            .then(response => {
              this.magickaSetter(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
        });
    
    this.setState({
      magicka: '',
    });

  }

  onWeaponSubmit(e) {
    e.preventDefault();

    const selectedWeapon = this.props.weaponArray[this.state.weapon];
    if(!selectedWeapon){return 1;}
    const obj = {
      sheet: this.state.id,
      name: selectedWeapon.name,
      cost: selectedWeapon.cost,
      damage: selectedWeapon.damage,
      ap: selectedWeapon.ap,
      range: selectedWeapon.range
    };
    axios.defaults.baseURL = '';
    axios.post('/weapon/add', obj, { baseUrl: "" })
        .then(res => console.log("Added weapon:",res.data))
        .then(res => {
          console.log("getting weapons for sheet:", this.state.id);
          axios.get('/weapon/'+this.state.id, { baseUrl: "" })
            .then(response => {
              this.weaponSetter(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
        });
    
    this.setState({
      weapon: '',
    });

  }

  onArmorSubmit(e) {
    e.preventDefault();

    const selectedArmor = this.props.armorArray[this.state.armor];
    if(!selectedArmor){return 1;}
    const obj = {
      sheet: this.state.id,
      name: selectedArmor.name,
      cost: selectedArmor.cost,
      damage: selectedArmor.damage,
      ap: selectedArmor.ap,
      range: selectedArmor.range
    };
    axios.defaults.baseURL = '';
    axios.post('/armor/add', obj, { baseUrl: "" })
        .then(res => console.log("Added armor:",res.data))
        .then(res => {
          console.log("getting armors for sheet:", this.state.id);
          axios.get('/armor/'+this.state.id, { baseUrl: "" })
            .then(response => {
              this.armorSetter(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
        });
    
    this.setState({
      armor: '',
    });

  }

  onHorseSubmit(e) {
    e.preventDefault();

    const selectedHorse = this.props.horseArray[this.state.horse];
    if(!selectedHorse){return 1;}
    const obj = {
      sheet: this.state.id,
      name: selectedHorse.name,
      cost: selectedHorse.cost,
      damage: selectedHorse.damage,
      ap: selectedHorse.ap,
      range: selectedHorse.range
    };
    axios.defaults.baseURL = '';
    axios.post('/horse/add', obj, { baseUrl: "" })
        .then(res => console.log("Added horse:",res.data))
        .then(res => {
          console.log("getting horses for sheet:", this.state.id);
          axios.get('/horse/'+this.state.id, { baseUrl: "" })
            .then(response => {
              this.horseSetter(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
        });
    
    this.setState({
      horse: '',
    });

  }

  onSpecialtySubmit(e) {
    e.preventDefault();

    var hasBoth = true;
    var first, second;
    if(this.state.specialtyFirst){
      first = this.state.specialtyFirst;
    }else{hasBoth=false;}
    if(this.state.specialtySecond){
      second = this.state.specialtySecond;
    }else{hasBoth=false;}
    if(!hasBoth){return 1;}

    var builtSpecialty = "[ " + first +" + "+ second +" ]";
    const obj = {
      sheet: this.state.id,
      specialty: builtSpecialty,
      cost: 4
    };
    axios.defaults.baseURL = '';
    axios.post('/specialty/add', obj, { baseUrl: "" })
        .then(res => console.log("Added specialty:",res.data))
        .then(res => {
          console.log("getting specialtys for sheet:", this.state.id);
          axios.get('/specialty/'+this.state.id, { baseUrl: "" })
            .then(response => {
              this.specialtySetter(response.data);
            })
            .catch(function (error) {
              console.log(error);
            })
        });
    
    this.setState({
      specialtyFirst: '',
      specialtySecond: ''
    });

  }


  componentDidMount() {
    // this.clearState();
    this.checkComponent();
    

    var coll = document.getElementsByClassName("collapsible");
    var active = document.getElementsByClassName("active");
    var i;

    for (i = 0; i < coll.length; i++) {
      coll[i].addEventListener("click", function() {
        this.classList.toggle("active");
        var content = this.nextElementSibling;
        if (content.style.maxHeight){
          content.style.maxHeight = null;
        } else {
          console.log("content: ",content);
          content.style.maxHeight = content.scrollHeight + "px";
        } 
      });
    }
    for(i = 0; i < active.length; i++){
      var content = active[i].nextElementSibling;
      console.log("content: ",content);
      content.style.maxHeight = content.scrollHeight + "px";
    }


    var editID = this.props.match.params.id;
    if(editID && editID.length){
      console.log("In Edit (componentDidMount), editID:",editID);
      this.onRefreshFromDB(editID);
    }else{
      console.log("In Create (componentDidMount), no editID found", editID);
    }

    // console.log("check if quirkSelectArray made it",this.props.quirkSelectArray);
  }

  undoClearAndRefresh(){
    this.setState(initialState, () => {
      this.onRefreshFromDB();
    });
  }

  onRefreshFromDB(){
    const scopedThis = this;
    axios.defaults.baseURL = '';
    axios.get('/sheet/edit/'+this.props.match.params.id, { baseUrl: "" })
      .then(response => {
        console.log("onRefreshFromDB, response.data:", response.data, this.props.match.params.id);
        this.setState(response.data.sheet, () => {
          console.log("this.state loaded from DB!", this.state);
          // this.setState({xps: response.data.xps});
          var myXP = 0;
          var sheetXP = [];
          response.data.xps.forEach(item => {
            if(item.target.includes(this.state.owner)){
              myXP += item.qty;
            }else{
              var lbl = item.gm;
              var val = item.qty;

              var found = sheetXP.find(obj => {
                return obj.label === lbl
              });

              if(found){
                found.value += val;
              }else{
                sheetXP.push({label: lbl, value: val});
              }
            }
          });

          this.setState({
            xpFromPlayer: myXP,
            xpFromCampaignObjs: sheetXP
          }, () => {
            if(this.state.xpFromCampaignObjs.length == 1){
              this.setState({xpFromCampaign: this.state.xpFromCampaignObjs[0].value});
            }
          });

          extrasList.forEach(extra => {
            axios.get('/'+extra+'/'+this.state.id,{ baseUrl: "" })
              .then(response => {
                this[extra+"Setter"](response.data);
                // this.quirkSetter(response.data);
              })
              .catch(function (error) {
                console.log(error);
              })
          });
          
        });
        
      })
      .catch(function (error) {
          console.log(error);
      });
    
  }


  tabRow(){
    const theSheet = this.state.id;
    const theQS = this.quirkSetter;
      return this.state.hasQuirk.map(function(object, i){
          return <QuirkTableRow obj={object} key={i} index={i} sheet={theSheet} quirkSetter={theQS}/>;
      });
    }



  tabFlawsRow(){
    const theSheet = this.state.id;
    const theQS = this.flawsSetter;
      return this.state.hasFlaws.map(function(object, i){
          return <FlawsTableRow obj={object} key={i} index={i} sheet={theSheet} flawsSetter={theQS}/>;
      });
    }

  tabMagickaRow(){
    const theSheet = this.state.id;
    const theQS = this.magickaSetter;
      return this.state.hasMagicka.map(function(object, i){
          return <MagickaTableRow obj={object} key={i} index={i} sheet={theSheet} magickaSetter={theQS}/>;
      });
    }

  tabWeaponRow(){
    const scopedThis = this;
    const extra = "weapon";
    const theSheet = this.state.id;
    const theQS = this.weaponSetter;
    const mSA = this.props.magickaSelectArray;
    const wepArr = this.state.hasWeapon;
    const mgkArr = this.props.magickaArray;
    var newArray = [];
    var hMGK = this.state.hasWeaponChildren;
    wepArr.forEach(wep => {
      var str = wep._id.toString();
      newArray.push(str);
    });
    // this.state.hasWeapon;
    console.log("tabWeaponRow hMGK: ", hMGK);

    if(wepArr.length > 0){
      if(this.state.hasWeaponChildren.length < 1){
        axios.defaults.baseURL = '';
        axios.post('/magicka/getmagickas', newArray, { baseUrl: "" })
          .then(res => {
            console.log("Found magicka:",res);
            console.log("getting magickas for weapons:", newArray,wepArr, res);
            var inbound = [];
            if(res && res.data && res.data.length > 0){
              inbound = res.data;
              console.log("tabWeaponRow inbound: ", inbound);
              var tally = 0, mag = 1;
              inbound.sort(this.compare);
              inbound.forEach(mgk => {
                tally += parseInt(mgk.cost) * mag;
                mag += 1;
              });
              this.setState({
                hasWeaponChildren: inbound,
                weaponChildrenCost: tally
              }, () => {
                hMGK = this.state.hasWeaponChildren;
              });
            }
          });
      }
      return wepArr.map(function(object, i){
        return <WeaponTableRow obj={object} key={i} index={i} 
                  sheet={theSheet} weaponSetter={theQS} 
                  mSA={mSA} hMGK={hMGK} 
                  magickaArray={mgkArr}/>;
      });
    }
    
    
  }

  tabArmorRow(){
    const theSheet = this.state.id;
    const theQS = this.armorSetter;
      return this.state.hasArmor.map(function(object, i){
          return <ArmorTableRow obj={object} key={i} index={i} sheet={theSheet} armorSetter={theQS}/>;
      });
    }

  tabHorseRow(){
    const theSheet = this.state.id;
    const theQS = this.horseSetter;
      return this.state.hasHorse.map(function(object, i){
          return <HorseTableRow obj={object} key={i} index={i} sheet={theSheet} horseSetter={theQS}/>;
      });
    }

  tabEmptyRow(){
    const theSheet = this.state.id;
    const theQS = this.emptySetter;
      return this.state.hasEmpty.map(function(object, i){
          return <EmptyTableRow obj={object} key={i} index={i} sheet={theSheet} emptySetter={theQS}/>;
      });
    }

  tabSpecialtyRow(){
    const theSheet = this.state.id;
    const theQS = this.specialtySetter;
      return this.state.hasSpecialty.map(function(object, i){
          return <SpecialtyTableRow obj={object} key={i} index={i} sheet={theSheet} specialtySetter={theQS}/>;
      });
    }

  quirkSetter(res){
    var i, tally=0, overflow=0;
    for(i=0;i < res.length;i++){
      var item = res[i];
      tally += parseInt(item.cost);
      if(item.name){overflow += item.name.length / emCalc.perLine }
      if(item.desc){overflow += item.desc.length / emCalc.perLine }
      if(item.prereq){overflow += emCalc.perProp + item.prereq.length / emCalc.perLine }
      if(item.benefit){overflow += emCalc.perProp + item.benefit.length / emCalc.perLine }
      if(item.aspects){overflow += emCalc.perProp + item.aspects.length / emCalc.perLine }
      if(item.aptitudes){overflow += emCalc.perProp + item.aptitudes.length / emCalc.perLine }
    }
    // console.log("quirkSetter",res, tally, overflow);
    this.setState({
       hasQuirk: res, 
       quirkTotalCost: tally,
       quirkOverflow: overflow
    }, () => {
      // this.checkXP();
      this.checkOverflow();
    });
  }



  flawsSetter(res){
    var i, tally=0, overflow=0;
    for(i=0;i < res.length;i++){
      var item = res[i];
      tally += parseInt(item.cost);
      if(item.name){overflow += item.name.length / emCalc.perLine }
      if(item.desc){overflow += item.desc.length / emCalc.perLine }
      if(item.prereq){overflow += emCalc.perProp + item.prereq.length / emCalc.perLine }
      if(item.benefit){overflow += emCalc.perProp + item.benefit.length / emCalc.perLine }
      if(item.aspects){overflow += emCalc.perProp + item.aspects.length / emCalc.perLine }
      if(item.aptitudes){overflow += emCalc.perProp + item.aptitudes.length / emCalc.perLine }
    }
    // console.log("flawsSetter",res, tally, overflow);
    this.setState({
       hasFlaws: res, 
       flawsTotalCost: tally,
       flawsOverflow: overflow
    }, () => {
      // this.checkXP();
      this.checkOverflow();
    });
  }

  magickaSetter(res){
    var i, tally=0, overflow=0;
    for(i=0;i < res.length;i++){
      var item = res[i];
      tally += parseInt(item.cost);
      if(item.name){overflow += item.name.length / emCalc.perLine }
      if(item.desc){overflow += item.desc.length / emCalc.perLine }
      if(item.prereq){overflow += emCalc.perProp + item.prereq.length / emCalc.perLine }
      if(item.benefit){overflow += emCalc.perProp + item.benefit.length / emCalc.perLine }
    }
    // console.log("magickaSetter",res, tally, overflow);
    this.setState({
       hasMagicka: res, 
       magickaTotalCost: tally,
       magickaOverflow: overflow
    }, () => {
      // this.checkXP();
      this.checkOverflow();
    });
  }

  weaponSetter(res){
    var i, tally=0, overflow=0;
    for(i=0;i < res.length;i++){
      var item = res[i];
      tally += parseInt(item.cost);
      if(item.name){overflow += item.name.length / emCalc.perLine }
      if(item.desc){overflow += item.desc.length / emCalc.perLine }
      if(item.prereq){overflow += emCalc.perProp + item.prereq.length / emCalc.perLine }
      if(item.benefit){overflow += emCalc.perProp + item.benefit.length / emCalc.perLine }
    }
    // console.log("weaponSetter",res, tally, overflow);
    this.setState({
       hasWeapon: res, 
       weaponTotalCost: tally,
       weaponOverflow: overflow
    }, () => {
      // this.checkXP();
      this.checkOverflow();
    });
  }

  armorSetter(res){
    var i, tally=0, overflow=0;
    for(i=0;i < res.length;i++){
      var item = res[i];
      tally += parseInt(item.cost);
      if(item.name){overflow += item.name.length / emCalc.perLine }
      if(item.desc){overflow += item.desc.length / emCalc.perLine }
      if(item.prereq){overflow += emCalc.perProp + item.prereq.length / emCalc.perLine }
      if(item.benefit){overflow += emCalc.perProp + item.benefit.length / emCalc.perLine }
    }
    // console.log("armorSetter",res, tally, overflow);
    this.setState({
       hasArmor: res, 
       armorTotalCost: tally,
       armorOverflow: overflow
    }, () => {
      // this.checkXP();
      this.checkOverflow();
    });
  }

  horseSetter(res){
    var i, tally=0, overflow=0;
    for(i=0;i < res.length;i++){
      var item = res[i];
      tally += parseInt(item.cost);
      if(item.name){overflow += item.name.length / emCalc.perLine }
      if(item.desc){overflow += item.desc.length / emCalc.perLine }
      if(item.prereq){overflow += emCalc.perProp + item.prereq.length / emCalc.perLine }
      if(item.benefit){overflow += emCalc.perProp + item.benefit.length / emCalc.perLine }
    }
    // console.log("horseSetter",res, tally, overflow);
    this.setState({
       hasHorse: res, 
       horseTotalCost: tally,
       horseOverflow: overflow
    }, () => {
      // this.checkXP();
      this.checkOverflow();
    });
  }

  emptySetter(res){
    var i, tally=0, overflow=0;
    for(i=0;i < res.length;i++){
      var item = res[i];
      if(item.empty){overflow += item.empty.length / emCalc.perLine }
    }
    // console.log("emptySetter",res, tally, overflow);
    this.setState({
       hasEmpty: res, 
       emptyOverflow: overflow
    }, () => {
      this.checkOverflow();
    });
  }

  specialtySetter(res){
    var i, tally=0, overflow=0;
    for(i=0;i < res.length;i++){
      var item = res[i];
      tally += parseInt(item.cost);
      if(item.specialty){overflow += item.specialty.length / emCalc.perLine }
    }
    // console.log("specialtySetter",res, tally, overflow);
    this.setState({
       hasSpecialty: res, 
       specialtyTotalCost: tally,
       specialtyOverflow: overflow
    }, () => {
      // this.checkXP();
      this.checkOverflow();
    });
  }

  toggleStatDescHidden(e) {
    // console.log("toggleStatDescHidden:",
    //     e.currentTarget,
    //     e.currentTarget.dataset, 
    //     this.refs[e.currentTarget.dataset.trgt]
    //   );
    if (e.currentTarget && e.currentTarget.dataset && e.currentTarget.dataset.trgt) {
      var elem = this.refs[e.currentTarget.dataset.trgt];
      if(elem.className.includes("hideStat")){
        elem.className = "statDesc";
      }else{
        elem.className = "hideStat";
      }
      // console.log("toggleStatDescHidden elem:",elem.className,elem);
      // className 
    }
  }

  mainStat(stat, isAspect=false) {
    // console.log("mainStat:", stat, isAspect);
    var title = stat.charAt(0).toUpperCase() + stat.substring(1);
    var val = this.state[stat].toString() ;
    var arr = [];
    if(isAspect){arr=aspectsJSON;}
      else{arr=aptitudesJSON}

    var i, statObj={};
    for(i=0;i < arr.length;i++){
      if(stat.includes(arr[i].name)){statObj = arr[i];}
    }

    return (
      <div className="form-group" key={title}>
          <label onClick={this.toggleStatDescHidden} data-trgt={stat+"Hidden"}>{title}: {val}</label>
          <div id={stat+"Hidden"} ref={stat+"Hidden"} className="hideStat">
            <p>{statObj.desc}</p>
          </div>
          <input type="range" 
            className="form-control"
            value={val}
            min="0" max="5" step="1"
            onChange={(e) => this.onChangeAspectAndAptitude(stat, e, isAspect)}
            />
      </div>
    );
  }

  displayStatArray(typeArray, isAspect=false){
    // console.log("displayStatArray:",typeArray, isAspect);
    var scopedThis = this;
    var statComponents = typeArray.map(function(stat) {
      return   scopedThis.mainStat(stat, isAspect) ;
    });
    return <div>{statComponents}</div>;
  }

  arrayToSelectOptions(array){
    var newArray = [];
    array.forEach(str => {
      var obj = {  label: str.charAt(0).toUpperCase() + str.substring(1),
                   value: str
                }
      newArray.push(obj);
    });
    return newArray;
  }

  codaDisplayAndSelect(extra, theRow, selectArray, onChange, totalCost, onSubmit, secondArray=null, secondChange=null) {
    var title = extra.charAt(0).toUpperCase() + extra.substring(1);
    var addBtnText = "Add " + title;
    var hasArray = this.state["has"+title];
    var showDesc = true;
    // console.log("codaDisplayAndSelect secondArray:", extra, selectArray, secondArray);
    if(extra.includes("specialty")){showDesc=false;}
    // var val = this.state[stat].toString() ;
    return (
      <div className="codaDisplayAndSelect">
        <div>
          <h3 align="center">{title} List</h3>
          <table className="table table-striped" style={{ marginTop: 20 }}>
            <thead>
              <tr>
                <th>Name</th>
                <th>Cost</th>
                { showDesc &&
                  <th>Description</th>
                }
                <th colSpan="1">Action</th>
              </tr>
            </thead>
            <tbody>
              { this[theRow]() }
            </tbody>
          </table>
        </div>

        <Select options={selectArray} 
            onChange={onChange} 
            placeholder="Pick one"
        />

        { secondArray &&
          <Select options={secondArray} 
            onChange={secondChange} 
            placeholder="Pick second"
          />
        }

        <p></p>
        <p>{this.state[extra]}</p>
        <p>Tallied Cost: {totalCost}</p>

        <div className="form-group">
            <input type="submit" 
              value={addBtnText}
              className="btn btn-primary"
              onClick={onSubmit}/>
        </div>
      </div>
    );
  }

  displayUpdateSubmitButton(){
    if(!this.props.match.params.id){return;}
    return (
      <div className="form-group">
          <input type="submit" 
            style={{float: 'right'}}
            value="Update Character" 
            className="btn btn-primary"/>
      </div>
    );
    
  }






 
  render() {



    return (

        <div style={{ marginTop: 10 }}>
            <h3 align="center">
              { this.props.match.params.id 
                  ? "Update Character Sheet" 
                  : "Add New Character Sheet"}
            </h3>
           
              { this.props.match.params.id 
                  ? <div>
                      <h3 style={{display: 'inline-block'}}>Remaining XP: {this.showXP()}</h3>
                      <button style={{float: 'right'}} onClick={this.undoClearAndRefresh} className="btn btn-danger">Undo Changes</button>
                      { this.state.xpFromCampaignObjs.length > 1 &&
                        <Select options={this.state.xpFromCampaignObjs} 
                          onChange={this.onChangeXPFromCampaign} 
                          placeholder="Choose a campaign XP source ..."
                        />
                      }
                    </div>
                  : <h3>Starting XP: {this.showXP()}</h3>}

            
            <form onSubmit={this.onSubmit}>

              <article className="tabs">

          <section id="tab1"
            style={{height: this.state.extrasOverflow+"em"}}>
            <h2><a href="#tab1">Character Desc</a></h2>
            <p> Name and description of your character - No rules are tied to this section, so it's up to you what you make!</p>
            <div className="form-group">
                        <label>Name:  </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={this.state.name}
                          onChange={this.onChangeName}
                          />
                    </div>
                    <div className="form-group">
                        <label>Concept:  </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          name="concept"
                          value={this.state.concept}
                          onChange={this.onChangeConcept}
                          />
                    </div>
                    <div className="form-group">
                        <label>Virtue:  </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={this.state.virtue}
                          onChange={this.onChangeVirtue}
                          />
                    </div>
                    <div className="form-group">
                        <label>Vice:  </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={this.state.vice}
                          onChange={this.onChangeVice}
                          />
                    </div>
                    <div className="form-group">
                        <label>Racial:  </label>
                        <input 
                          type="text" 
                          className="form-control" 
                          value={this.state.racial}
                          onChange={this.onChangeRacial}
                          />
                    </div>
                    <div className="form-group">
                        <label>Description: </label>
                        <textarea className="form-control" 
                        rows = "5" cols = "60" name = "description"
                        value={this.state.description}
                          onChange={this.onChangeDescription}
                          />
                    </div>
                    
                    <p className="tabnav"><a href="#tab2">next &#10151;</a></p>
                    {this.displayUpdateSubmitButton()}
          </section>
          
          <section id="tab2"
            style={{height: this.state.extrasOverflow+"em"}}>
            <h2><a href="#tab2">Aspects</a></h2>
            <p> Use 5|4|3 rule in the coda to select your Aspects.</p>
            <p> Click the stats name for a description! </p>
            { navigator.userAgent.match(/(iPhone|iPod|iPad)/)
              ? <p> Drag dots left or right to set </p>
              : <p> Click or drag dots left or right to set </p>
            } 
            
            

            <div className="aspect">
            <h3 align="center">Mental: {this.state.mental}</h3>           
            <p>{this.state.aspect_mental_msg}</p>
                    
                    { this.displayStatArray(mentalAspects, true) }
                    </div>

                    <div className="aspect">
            <h3 align="center">Physical: {this.state.physical}</h3>
            <p>{this.state.aspect_physical_msg}</p>

                    { this.displayStatArray(physicalAspects, true) }

                    </div>


                    <div className="aspect">
            <h3 align="center">Social: {this.state.social}</h3>
            <p>{this.state.aspect_social_msg}</p>
                    { this.displayStatArray(socialAspects, true) }
                    </div>
            <p className="tabnav"><a href="#tab3">next &#10151;</a></p>
                    {this.displayUpdateSubmitButton()}
          </section>


          
          <section id="tab3"
            style={{height: this.state.extrasOverflow+"em"}}>
            <h2><a href="#tab3">Aptitudes</a></h2>
            <p> Click the stats name for a description! </p>
            
            { this.checkIfComponent("Edit")  && 
              <p> Aptitudes cost 3x desired dot to increase. </p> 
            }
              
            { this.checkIfComponent("Create") && this.state.aptitude_total > 0 &&
              <p> You get {this.state.aptitude_total} points to spend here, on top of the items already at +1. </p>
            }
            { this.checkIfComponent("Create") && this.state.aptitude_total == 0 &&
              <p> You have spent all {this.state.aptitude_total} points, any additional aptitudes cost 3 XP per dot. </p>
            }
            { this.checkIfComponent("Create") && this.state.aptitude_total < 0 &&
              <p> You have {20 - this.state.aptitude_total} total aptitudes selected. You have spent {-3 * this.state.aptitude_total} XP so far. </p>
            } 
            
                   

                    <div className="aptitude">
                      <h3 align="center">Combat Aptitudes:</h3>
                      { this.displayStatArray(combatAptitudes) }
                    </div>

                    <div className="aptitude">
                      <h3 align="center">Non-Combat Aptitudes:</h3>
                      { this.displayStatArray(nonCombatAptitudes) }
                    </div>

                    
                    <p className="tabnav"><a href="#tab4">next &#10151;</a></p>
                    {this.displayUpdateSubmitButton()}
          </section>


          
          <section id="tab4"
            style={{height: this.state.extrasOverflow+"em"}}>
            <h2><a href="#tab4">Composite Stats</a></h2>
            <p> Mostly for after Character Creation, but some stats don't fit elsewhere. </p>
            <p> These stats are editable. </p>
            <div className="form-group">
                        <label>Size: {this.state.size}</label>
                        <input type="range" 
                          className="form-control"
                          value={this.state.size}
                          min="1" max="6" step="1"
                          onChange={this.onChangeSize}
                          />
                    </div>
            <p> These stats are not editable. </p>
            <div className="form-group">
                        <label>Astrylose: {this.state.astrylose}</label>
                        <input type="range" 
                          className={["tennerRed","form-control","noedit"].join(' ')}
                          value={this.state.astrylose}
                          min="0" max="10" step="1"
                          onChange={this.onChangeNothing}
                          />
                    </div>
            <div className="form-group">
                        <label>Willpower: {this.state.willpower}</label>
                        <input type="range" 
                          className={["tennerBlue","form-control","noedit"].join(' ')}
                          value={this.state.willpower}
                          min="0" max="10" step="1"
                          onChange={this.onChangeNothing}
                          />
                    </div>
            <div className="form-group">
                        <label>Vitality: {this.state.vitality}</label>
                        <input type="range" 
                          className={["tennerGreen","form-control","noedit"].join(' ')}
                          value={this.state.vitality}
                          min="0" max="10" step="1"
                          onChange={this.onChangeNothing}
                          />
                    </div>
            <div className="form-group">
                        <label>Speed: {this.state.speed}</label>
                        <input type="range" 
                          className={["tennerCyan","form-control","noedit"].join(' ')}
                          value={this.state.speed}
                          min="0" max="10" step="1"
                          onChange={this.onChangeNothing}
                          />
                    </div>
            <div className="form-group">
                        <label>Initiative: {this.state.initiative}</label>
                        <input type="range" 
                          className={["tennerYellow","form-control","noedit"].join(' ')}
                          value={this.state.initiative}
                          min="0" max="10" step="1"
                          onChange={this.onChangeNothing}
                          />
                    </div>
            <div className="form-group">
                        <label>Defense: {this.state.defense}</label>
                        <input type="range" 
                          className={["noedit","form-control"].join(' ')}
                          value={this.state.defense}
                          min="0" max="10" step="1"
                          onChange={this.onChangeNothing}
                          />
                    </div>
            
                    <p className="tabnav"><a href="#tab5">next &#10151;</a></p>
                    {this.displayUpdateSubmitButton()}
          </section>


          
          
          <section id="tab5"
            style={{height: this.state.extrasOverflow+"em"}}>
            <h2><a href="#tab5">Specialties</a></h2>
            <p>Select an Aspect and Aptitude for your specialty. You'll gain +1 anytime you roll those stats.  Specialties cost 4 XP, and cannot be taken twice.</p>


          { this.codaDisplayAndSelect("specialty", 
                    "tabSpecialtyRow", 
                    this.arrayToSelectOptions(allAspects), 
                    this.onChangeFirstSpecialty, 
                    this.state.specialtyTotalCost, 
                    this.onSpecialtySubmit,
                    this.arrayToSelectOptions(nonCombatAptitudes),
                    this.onChangeSecondSpecialty ) }


            <p className="tabnav"><a href="#tab7">next &#10151;</a></p>
                    {this.displayUpdateSubmitButton()}
          </section>


          
          <section id="tab6"
            style={{height: this.state.extrasOverflow+"em"}}>
 
            <h2><a href="#tab6">Finishing Touches</a></h2>
            <p> Any additional notes for your character can be added here: </p>

            
              



            <div className="codaDisplayAndSelect">
              <div>
                <h3 align="center">Text Extra List</h3>
                <table className="table table-striped" style={{ marginTop: 20 }}>
                  <thead>
                    <tr>
                      <th className="tdRightPad">Text</th>
                      <th>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    { this.tabEmptyRow() }
                  </tbody>
                </table>
              </div>
              <div className="form-group">
                <label>Text: </label>
                <textarea className="form-control" 
                rows = "2" cols = "60" name = "description"
                value={this.state.empty}
                  onChange={this.onChangeEmpty}
                  />
              </div>
              <div className="form-group">
                  <input type="submit" 
                    value="Add Text"
                    className="btn btn-primary"
                    onClick={this.onEmptySubmit}/>
              </div>
            </div>    



          

                    <div className="form-group">
                        <input type="submit" 
                          style={{float: 'right'}}
                          value={ this.props.match.params.id 
                            ? "Update Character" 
                            : "Save Character"}
                          className="btn btn-primary"/>
                    </div>
                      <button  onClick={this.onRefreshFromDB} className="btn btn-danger">Undo Changes</button>
            <p className="tabnav"><a href="#tab1">next &#10151;</a></p>

          </section>





          
          <section id="tab7"
            style={{height: this.state.extrasOverflow+"em"}}>
            <h2><a href="#tab7">Quirks & Flaws</a></h2>
            <p>Quirks add unique extras to your character.  You may add any of them to read their description, and remove them if you do not like them.  Their Cost is an XP. </p>

            { this.codaDisplayAndSelect("quirk", 
                    "tabRow", 
                    this.props.quirkSelectArray, 
                    this.onChangeQuirk, 
                    this.state.quirkTotalCost, 
                    this.onQuirkSubmit) }

            <p>Flaws add unique extras to your character, and their cost add to your XP!  You may add any of them to read their description, and remove them if you do not like them.  </p>

              { this.codaDisplayAndSelect("flaws", 
                    "tabFlawsRow", 
                    this.props.flawsSelectArray, 
                    this.onChangeFlaws, 
                    this.state.flawsTotalCost, 
                    this.onFlawsSubmit) }

              
            
              { this.state.flawsTotalCost < -14  &&
                <h3 className="warning"> 
                  You can take more than -15 points in Flaws, but you can only gain a maximum of 15 XP from them.
                </h3> 
              }
            
            

            <p className="tabnav"><a href="#tab8">next &#10151;</a></p>
                    {this.displayUpdateSubmitButton()}
          </section>






          
          <section id="tab8"
            style={{height: this.state.extrasOverflow+"em"}}>
            <h2><a href="#tab8">Magicka</a></h2>
            <p> Each Magicka is an ability your character has, and cost one Astrylose to activate.  You may add any of them to read their description, and remove them if you do not like them. </p>

            { this.codaDisplayAndSelect("magicka", 
                    "tabMagickaRow", 
                    this.props.magickaSelectArray, 
                    this.onChangeMagicka, 
                    this.state.magickaTotalCost, 
                    this.onMagickaSubmit) }
          

            <p className="tabnav"><a href="#tab9">next &#10151;</a></p>
                    {this.displayUpdateSubmitButton()}
          </section>






          
          <section id="tab9"
            style={{height: this.state.extrasOverflow+"em"}}>
            <h2><a href="#tab9">Weapons</a></h2>
            <p> Each Weapon represents an item so superior and majestic that it adds dice to your rolls. Adding mundane weapons can be done in Finishing Touches.  You may add any of them to read their description, and remove them if you do not like them. </p>
            

            { this.codaDisplayAndSelect("weapon", 
                    "tabWeaponRow", 
                    this.props.weaponSelectArray, 
                    this.onChangeWeapon, 
                    this.state.weaponTotalCost, 
                    this.onWeaponSubmit) }
          

            <p className="tabnav"><a href="#tab10">next &#10151;</a></p>
                    {this.displayUpdateSubmitButton()}
          </section>






          
          <section id="tab10"
            style={{height: this.state.extrasOverflow+"em"}}>
            <h2><a href="#tab10">Armor</a></h2>
            <p> Each Armor represents an item so superior and majestic that it removes dice from your enemies rolls. Adding mundane armor/clothing can be done in Finishing Touches.  You may add any of them to read their description, and remove them if you do not like them. </p>

            { this.codaDisplayAndSelect("armor", 
                    "tabArmorRow", 
                    this.props.armorSelectArray, 
                    this.onChangeArmor, 
                    this.state.armorTotalCost, 
                    this.onArmorSubmit) }


            <p className="tabnav"><a href="#tab11">next &#10151;</a></p>
                    {this.displayUpdateSubmitButton()}
          </section>






          
          <section id="tab11"
            style={{height: this.state.extrasOverflow+"em"}}>
            <h2><a href="#tab11">Horses</a></h2>
            <p> These are not used often, but contain the stats for Horses and other vehicles.  You may add any of them to read their description, and remove them if you do not like them. </p>

            
              { this.codaDisplayAndSelect("horse", 
                    "tabHorseRow", 
                    this.props.horseSelectArray, 
                    this.onChangeHorse, 
                    this.state.horseTotalCost, 
                    this.onHorseSubmit) }
          

            <p className="tabnav"><a href="#tab6">next &#10151;</a></p>
                    {this.displayUpdateSubmitButton()}
          </section>




        </article>




                
            </form>
        </div>
    )
  }
}