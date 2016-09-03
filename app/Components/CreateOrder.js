import React from 'react';
import axios from 'axios';
import RaisedButton from 'material-ui/lib/raised-button';
import Dialog from 'material-ui/lib/dialog';
import FlatButton from 'material-ui/lib/flat-button';
import TextField from 'material-ui/lib/text-field';
import Checkbox from 'material-ui/lib/checkbox';
import SelectField from 'material-ui/lib/select-field';
import MenuItem from 'material-ui/lib/menus/menu-item';
import DatePicker from 'material-ui/lib/date-picker/date-picker';
import RefreshIndicator from 'material-ui/lib/refresh-indicator';
import config from '../Config';
import styles from '../Styles';

export default class CreateOrder extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      open: false,
      dialog:{
        title:'',
        data:[],
      },
      fullAdrInd: 'hide',
      orderInd: 'hide',
      butDisabled: false,
      order:{
        fullAdr: '',
        name: '',
        index: '',
        region: '',
        city: '',
        street: '',
        streetAbbr:'',
        house:'',
        houseKorpus:'',
        str: '',
        flat:'',
        office:'',
        contactFio:'',
        contactPhone:'',
        workTimeFrom: config.defaults.workTimeFrom,
        workTimeTo: config.defaults.workTimeTo,
        orderNumberInternal:'',
        datePickup:null,
        cargoNumPack: config.defaults.cargoNumPack,
        cargoWeight: config.defaults.cargoWeight,
        cargoVolume: config.defaults.cargoVolume,
        cargoValue: '',
        cargoCategory: config.defaults.cargoCategory,
        deliveryTimePeriod: config.defaults.deliveryTimePeriod,
        npp: true,
        ozhd: true,
        dvd: true,
        sms: true,
        cargoRegistered: false,
        instructions:'',
      },
      error:{
        fullAdr:'',
        name: '',
        region: '',
        city: '',
        street: '',
        streetAbbr:'',
        house:'',
        contactFio:'',
        contactPhone:'',
        contactEmail:'',
        orderNumberInternal:'',
        cargoNumPack: '',
        cargoWeight: '',
        cargoVolume: '',
        cargoValue: '',
        cargoCategory: '',
      }
    };
  }


  handleCheckFullAdr = (e) => {
    let query = encodeURIComponent(this.state.order.fullAdr);
    if(!query){
      return false;
    }
    this.setState({fullAdrInd: "loading"});
    this.setState({butDisabled: true});
    axios.post(config.fullAdrPath,{
      query: query
    })
    .then(function (response) {
      if(response.data.addresses){
        let adr = {};
        response.data.addresses[0].fields.forEach(function(item){
          if(item.level=='Region' && item.name){
            adr = Object.assign(adr, {region: item.name});
            if(item.type=="г"){
              adr = Object.assign(adr, {city: item.name});
            }
          }
          if(item.level=='Place' && item.name){
            if(item.type=="д"){
              adr = Object.assign(adr, {city: item.name});
            }
          }
          if(item.level=='City' && item.name){
            adr = Object.assign(adr, {city: item.name});
          }
          if(item.level=='Street' && item.name){
            adr = Object.assign(adr, {
              street: item.name,
              streetAbbr: item.type
            });
          }
          if(item.level=='House' && item.name){
            adr = Object.assign(adr, {house: item.name});
          }
          if(item.level=='Building' && item.name){
            adr = Object.assign(adr, {houseKorpus: item.name});
          }
          if(item.level=='Structure' && item.name){
            adr = Object.assign(adr, {str: item.name});
          }
          if(item.level=='Flat' && item.name){
            if(item.type=="офис"){
              adr = Object.assign(adr, {office: item.name});
            }else{
              adr = Object.assign(adr, {flat: item.name});
            }
          }
          if(item.level=='Zip' && item.name){
            adr = Object.assign(adr, {index: item.name});
          }
          this.setState({order: Object.assign(this.state.order, adr)});
        }.bind(this));

      }
      this.setState({fullAdrInd: "hide"});
      this.setState({butDisabled: false});
      console.log(response);
    }.bind(this))
    .catch(function (response) {
      this.setState({fullAdrInd: "hide"});
      this.setState({butDisabled: false});
      console.log(response);
    }.bind(this));
  }

  handleSendOrder = (e) => {
    this.setState({orderInd: "loading"});
    this.setState({butDisabled: true});
    const error = this.state.error;
    for(var key in error) {
      if(error[key]) {
        this.setState({
          error: Object.assign(
            this.state.error,
            {[key]:''}
          )
        });
      }
    }
    axios.post(config.sendOrderPath,
      this.state.order
    )
    .then(function (response) {
      this.setState({orderInd: "hide"});
      this.setState({butDisabled: false});
      console.log(response);
      if(response.data.data){
        let dialog = {
          title:'Создание заказа',
          data: []
        };
        dialog.data.push({
          name:'id заказа',
          value: response.data.data.orderNumberInternal
        });
        if(response.data.data.orderNum){
          dialog.data.push({
            name:'id доставки',
            value:response.data.data.orderNum
          });
        }
        dialog.data.push({
          name:'Статус',
          value:response.data.data.status
        });
        if(response.data.data.errorMessage){
          dialog.data.push({
            name:'Ошибка',
            value:response.data.data.errorMessage
          });
        }
        this.setState({dialog: dialog});
        this.setState({open: true});
        console.log(this.state);
      }

      if(response.data.error){
        response.data.error.forEach(function(item){
          this.setState({
            error: Object.assign(
              this.state.error,
              {[item[0]]: item[1]}
            )
          });
        }.bind(this));
      }

    }.bind(this))
    .catch(function (response) {
      this.setState({orderInd: "hide"});
      this.setState({butDisabled: false});
      console.log(response);
    }.bind(this));
  }

  handleChange = (field) => {
    return (e) => {
  	   this.setState({
         order: Object.assign(
           this.state.order,
           {[field]: e.target.value}
         )
       });
  	}
  }

  handleChangeChbx = (field) => {
    return (e) => {
  	   this.setState({
         order: Object.assign(
           this.state.order,
           {[field]: e.target.checked}
         )
       });
  	}
  }

  handleChangeDatePickup = (event, date) => {
    this.setState({
      order: Object.assign(
        this.state.order,
        {datePickup: date}
      )
    });
  }

  handleChangeSlct = (field) => {
    return (event, index, value) => {
      this.setState({
        order: Object.assign(
          this.state.order,
          {[field]: value}
        )
      });
    }
  }

  handleOpen = () => {
    this.setState({open: true});
  };

  handleClose = () => {
    this.setState({open: false});
  };

  render () {

    const actions = [
      <FlatButton
        label="закрыть"
        secondary={true}
        onTouchTap={this.handleClose}
      />,
      <FlatButton
        label="Ок"
        primary={true}
        keyboardFocused={true}
        onTouchTap={this.handleClose}
      />,
    ];

    const dialog = this.state.dialog.data.map(function(p) {
      return (<p>{p.name}: {p.value}</p>);
    });

	  return (
      <div style={styles.tab}>
      <Dialog
        title={this.state.dialog.title}
        actions={actions}
        modal={false}
        open={this.state.open}
        onRequestClose={this.handleClose}
      >
        {dialog}
      </Dialog>
        <div>
          <TextField
            ref="fullAdr"
            hintText=""
            floatingLabelText="Полный адрес доставки"
            multiLine={true}
            fullWidth={true}
            rows={1}
            rowsMax={2}
            errorText={this.state.error.fullAdr}
            value={this.state.order.fullAdr}
            onChange={this.handleChange('fullAdr')}
          />
          <RaisedButton
            disabled={this.state.butDisabled}
            label="Проверить адрес"
            secondary={true}
            onClick={this.handleCheckFullAdr}
          />
          <RefreshIndicator
            ref="fullAdrInd"
            size={40}
            left={10}
            top={10}
            status={this.state.fullAdrInd}
            style={styles.refresh}
          />
        </div>
        <div classref="left" style={styles.left}>
          <h3 style={styles.subTitle}>Адрес доставки</h3>
          <TextField
            ref="name"
            hintText=""
            floatingLabelText="Название компании"
            fullWidth={true}
            errorText={this.state.error.name}
            value={this.state.order.name}
            onChange={this.handleChange('name')}
          />
          <TextField
            style={{width:'50%'}}
            ref="workTimeFrom"
            floatingLabelText="Время работы от"
            value={this.state.order.workTimeFrom}
            onChange={this.handleChange('workTimeFrom')}
          />
          <TextField
            style={{width:'50%'}}
            ref="workTimeTo"
            floatingLabelText="Время работы до"
            value={this.state.order.workTimeTo}
            onChange={this.handleChange('workTimeTo')}
          />
          <TextField
            ref="index"
            hintText=""
            floatingLabelText="Индекс"
            fullWidth={true}
            value={this.state.order.index}
            onChange={this.handleChange('index')}
          />
          <TextField
            ref="region"
            hintText=""
            floatingLabelText="Регион"
            fullWidth={true}
            errorText={this.state.error.region}
            value={this.state.order.region}
            onChange={this.handleChange('region')}
          />
          <TextField
            ref="city"
            hintText=""
            floatingLabelText="Город"
            fullWidth={true}
            errorText={this.state.error.city}
            value={this.state.order.city}
            onChange={this.handleChange('city')}
          />
          <TextField
            ref="street"
            hintText=""
            floatingLabelText="Улица (формат ФИАС)"
            fullWidth={true}
            errorText={this.state.error.street}
            value={this.state.order.street}
            onChange={this.handleChange('street')}
          />
          <TextField
            ref="streetAbbr"
            hintText=""
            floatingLabelText="Сокращения типа улицы (ул и т.д.)"
            fullWidth={true}
            errorText={this.state.error.streetAbbr}
            value={this.state.order.streetAbbr}
            onChange={this.handleChange('streetAbbr')}
          />
          <TextField
            ref="house"
            style={{width:100}}
            floatingLabelText="Дом"
            fullWidth={true}
            errorText={this.state.error.house}
            value={this.state.order.house}
            onChange={this.handleChange('house')}
          />
          <TextField
            ref="houseKorpus"
            style={{width:100, marginLeft:1}}
            floatingLabelText="Корпус"
            fullWidth={true}
            value={this.state.order.houseKorpus}
            onChange={this.handleChange('houseKorpus')}
          />
          <TextField
            style={{width:100, marginLeft:1}}
            ref="str"
            floatingLabelText="Строение"
            fullWidth={true}
            value={this.state.order.str}
            onChange={this.handleChange('str')}
          />
          <TextField
            ref="office"
            hintText=""
            floatingLabelText="Офис"
            fullWidth={true}
            value={this.state.order.office}
            onChange={this.handleChange('office')}
          />
          <TextField
            ref="flat"
            hintText=""
            floatingLabelText="Квартира"
            fullWidth={true}
            value={this.state.order.flat}
            onChange={this.handleChange('flat')}
          />
          <TextField
            ref="contactFio"
            floatingLabelText="Контактное лицо"
            fullWidth={true}
            errorText={this.state.error.contactFio}
            value={this.state.order.contactFio}
            onChange={this.handleChange('contactFio')}
          />
          <TextField
            ref="contactPhone"
            floatingLabelText="Контактный телефон"
            fullWidth={true}
            errorText={this.state.error.contactPhone}
            value={this.state.order.contactPhone}
            onChange={this.handleChange('contactPhone')}
          />
        </div>
        <div classref="right" style={styles.right}>
          <h3 style={styles.subTitle}>Параметры заказа</h3>
          <TextField
            ref="orderNumberInternal"
            floatingLabelText="Номер заказа"
            fullWidth={true}
            errorText={this.state.error.orderNumberInternal}
            value={this.state.order.orderNumberInternal}
            onChange={this.handleChange('orderNumberInternal')}
          />
          <DatePicker
            ref="datePickup"
            style={styles.datepicker}
            hintText="Дата приёма груза"
            mode="landscape"
            autoOk={true}
            formatDate={(date) => {
                return date.getDate()+"-"+(date.getMonth()+1)+"-"+date.getFullYear();
              }
            }
            value={this.state.order.datePickup}
            onChange={this.handleChangeDatePickup}
          />
          <TextField
            ref="cargoNumPack"
            hintText="1"
            floatingLabelText="Количество грузомест"
            fullWidth={true}
            errorText={this.state.error.cargoNumPack}
            value={this.state.order.cargoNumPack}
            onChange={this.handleChange('cargoNumPack')}
          />
          <TextField
            ref="cargoWeight"
            hintText="1"
            floatingLabelText="Вес отправки, кг"
            fullWidth={true}
            errorText={this.state.error.cargoWeight}
            value={this.state.order.cargoWeight}
            onChange={this.handleChange('cargoWeight')}
          />
          <TextField
            ref="cargoVolume"
            hintText="0.05"
            floatingLabelText="Объём, м3"
            fullWidth={true}
            errorText={this.state.error.cargoVolume}
            value={this.state.order.cargoVolume}
            onChange={this.handleChange('cargoVolume')}
          />
          <TextField
            ref="cargoValue"
            hintText=""
            floatingLabelText="Сумма объявленной ценности, руб."
            fullWidth={true}
            errorText={this.state.error.cargoValue}
            value={this.state.order.cargoValue}
            onChange={this.handleChange('cargoValue')}
          />
          <TextField
            ref="cargoCategory"
            hintText=""
            floatingLabelText="Содержимое отправки"
            fullWidth={true}
            errorText={this.state.error.cargoCategory}
            value={this.state.order.cargoCategory}
            onChange={this.handleChange('cargoCategory')}
          />
          <SelectField
            fullWidth={true}
            value={this.state.order.deliveryTimePeriod}
            onChange={this.handleChangeSlct('deliveryTimePeriod')}
            floatingLabelText="Интервал времени доставки"
          >
            <MenuItem value="9-18" primaryText="9-18"/>
            <MenuItem value="9-14" primaryText="9-14"/>
            <MenuItem value="13-18" primaryText="13-18"/>
            <MenuItem value="18-22" primaryText="18-22"/>
            <MenuItem value="9-22" primaryText="9-22"/>
          </SelectField>
          <TextField
            ref="instructions"
            hintText=""
            floatingLabelText="Инструкции для курьера"
            multiLine={true}
            fullWidth={true}
            rows={1}
            rowsMax={2}
            value={this.state.order.instructions}
            onChange={this.handleChange('instructions')}
          />
          <br /><br /><br />
          <Checkbox
            ref="npp"
            label="Наложенный платеж"
            checked={this.state.order.npp}
            style={styles.checkbox}
            onCheck={this.handleChangeChbx('npp')}
          />
          <Checkbox
            ref="ozhd"
            label="Ожидание на адресе"
            checked={this.state.order.ozhd}
            style={styles.checkbox}
            onCheck={this.handleChangeChbx('ozhd')}
          />
          <Checkbox
            ref="dvd"
            label="Доставка в выходные дни"
            checked={this.state.order.dvd}
            style={styles.checkbox}
            onCheck={this.handleChangeChbx('dvd')}
          />
          <Checkbox
            ref="sms"
            label="SMS уведомление"
            checked={this.state.order.sms}
            style={styles.checkbox}
            onCheck={this.handleChangeChbx('sms')}
          />
          <Checkbox
            ref="cargoRegistered"
            label="Ценный груз."
            checked={this.state.order.cargoRegistered}
            style={styles.checkbox}
            onCheck={this.handleChangeCargoRegistered}
          />
        </div>
        <br /><br />
        <RaisedButton
          ref="orderBut"
          disabled={this.state.butDisabled}
          label="Отправить заказ"
          primary={true}
          style={styles.adrBut}
          onClick={this.handleSendOrder}
        />
        <RefreshIndicator
          ref="orderInd"
          size={40}
          left={10}
          top={10}
          status={this.state.orderInd}
          style={styles.refresh}
        />
        <br /><br />
      </div>
	  )
	}
}
