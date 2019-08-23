import { cityData } from './city.js'

const component = {
  /**
   * 组件的属性列表
   */
  properties: {
		province: {
		  type: String,
		  value: ''
		},
		city: {
		  type: String,
		  value: ''
		},
		county: {
		  type: String,
		  value: ''
		},
		fontSet:{
			type: Boolean,
			value: false
		}
  },

  /**
   * 组件的初始数据
   */
  data: {
    provinces: [],
    province: "北京市",
    citys: [],
    city: "北京城区",
    countys: [],
    county: "昌平区",
    value: [0, 0, 0],
    isShow: false,
		fontSet:false
  },

  attached() {
    let citys = cityData['districts'][0]['districts'];
    citys.sort((a, b) => {
      if (a['adcode'] - 0 < b['adcode'] - 0) {
        return -1;
      }
      if (a['adcode'] - 0 > b['adcode'] - 0) {
        return 1;
      }
      return 0;
    });
    this.setData({
      provinces: citys,
      citys: citys[0]['districts'],
      countys: citys[0]['districts'][0]['districts']
    });
  },

  /**
   * 组件的方法列表
   */
  methods: {
    bindChange(e) {
      const val = e.detail.value;
      this.setData({
        value: val,
        citys: this.data.provinces[val[0]]['districts'].length > 0 ? this.data.provinces[val[0]]['districts'] : [],
        countys: this.data.provinces[val[0]]['districts'].length > 0 ? (this.data.provinces[val[0]]['districts'][val[1]] ? this.data.provinces[val[0]]['districts'][val[1]]['districts'] : []) : '',
				fontSet:true
			})
    },
    closeModal() {
      this.setData({
        isShow: false
      })
    },
    togglePicker() {
      this.setData({
        isShow: !this.data.isShow
      })
    },
    cancel() {
      this.setData({
        isShow: false
      })
    },
    done() {
      const val = this.data.value;
      this.setData({
        province: this.data.provinces[val[0]].name,
        city: this.data.provinces[val[0]]['districts'].length > 0 ? this.data.provinces[val[0]]['districts'][val[1]].name : '',
        county: this.data.provinces[val[0]]['districts'].length > 0 ? (this.data.provinces[val[0]]['districts'][val[1]]['districts'][val[2]] ? this.data.provinces[val[0]]['districts'][val[1]]['districts'][val[2]].name : '') : '',
        isShow: false
      });
      this.triggerEvent('selected', {
        province: this.data.province,
        city: this.data.city,
        county: this.data.county
      })
    }
  }
}

Component(component)
