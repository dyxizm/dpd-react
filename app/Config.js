
export default {
  fullAdrPath:'/dpd/api.php?url=fullAdr',
  sendOrderPath:'/dpd/api.php?url=sendOrder',
  defaults:{
    country: "Россия",
    workTimeFrom: '9:00',
    workTimeTo: '18:00',
    serviceCode: "PCL",
    serviceVariant: "ТД",
    cargoVolume: 0.05,
    cargoNumPack: 1,
    cargoWeight: 1,
    cargoCategory: "Картина",
    deliveryTimePeriod: "9-18",
  },
}
