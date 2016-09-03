import React from 'react'

import Tabs from 'material-ui/lib/tabs/tabs';
import Tab from 'material-ui/lib/tabs/tab';
import CreateOrder from './CreateOrder'
import styles from '../Styles';


export default class App extends React.Component {

	constructor() {
    super();
		this.state = {
		}
	}

	componentDidMount(){
	}

	render() {
	  return (
		  <Tabs style={styles.tabs} tabItemContainerStyle={styles.tabsWrap}>
			  <Tab label="Создать заказ" >
					<CreateOrder />
			  </Tab>
			  <Tab label="Проверить заказ" >
					<div style={styles.tab}>
						2
					</div>
			  </Tab>
			  <Tab label="Проверить трек код" >
					<div style={styles.tab}>
						3
					</div>
				</Tab>
			</Tabs>
	  )
	}
}
