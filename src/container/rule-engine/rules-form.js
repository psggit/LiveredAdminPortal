import React from 'react'
import PageHeader from 'Components/pageheader'
import RuleHeader from './rule-header'
import Label from 'Components/label'
import Select from "Components/select"
import Button from "Components/button"
import './rule-engine.scss'
import moment from "moment"
import * as Api from "../../api"

class RuleManagement extends React.Component {
  constructor() {
    super()
    this.days = [
      { value: 1, label: 'Monday' },
      { value: 2, label: 'Tuesday' },
      { value: 3, label: 'Wednesday' },
      { value: 4, label: 'Thursday' },
      { value: 5, label: 'Friday' },
      { value: 6, label: 'Saturday' },
      { value: 7, label: 'Sunday' }
    ]
    this.state = {
      possessionLimits: [],
      timeRestrictions: [],
      legalPurchaseAge: "",
      zoneRestrictions: [],
      permitRules: {},
      rulesData: {},
      stateList: [],
      selectedStateIdx: -1,
      selectedStateName: ""
    }

    this.formatResponse = this.formatResponse.bind(this)
    this.fetchRules = this.fetchRules.bind(this)
    this.handleChange = this.handleChange.bind(this)
  }

  /**
   * Fetches rules of given state_id
   */
  componentDidMount() {
    Api.fetchStateAndCitiesList({})
      .then((response) => {
        const stateList = response.states.map((item) => {
          return {
            text: item.state_name,
            value: item.id
          }
        })
        this.setState({
          stateList,
          selectedStateIdx: stateList[0].value,
          selectedStateName: stateList[0].text
        })
      })
      .catch((err) => {
        console.log("Error in fetching states and cities")
      })
  }

  handleChange(e) {
    this.setState({
      selectedStateIdx: parseInt(e.target.value),
      selectedStateName: this.state.stateList.find((item) => item.value === parseInt(e.target.value)).text
    })
  }

  fetchRules() {
    Api.fetchRules({
      state_id: this.state.selectedStateIdx
    })
      .then((response) => {
        this.formatResponse(response)
      })
      .catch((err) => {
        console.log("Error in fetching rule list", err)
      })
  }

  /**
   * Map's weekday_id and get weekday_label and initializes state
   */
  formatResponse(response) {
    let timeRestrictions = []
    if (response.rules.time_restrictions.length > 0) {
      timeRestrictions = response.rules.time_restrictions.map((item) => {
        return { ...item, weekday_name: this.days.find(dayItem => dayItem.value === item.weekday_id).label }
      })
    }
    this.setState({
      timeRestrictions: timeRestrictions,
      legalPurchaseAge: response.rules.consumer_min_age,
      possessionLimits: response.rules.possession_limit,
      permitRules: response.rules.permit_rules,
      zoneRestrictions: response.rules.city_special_days.concat(response.rules.state_special_days)
    })
  }

  updateZoneRestrictions(id) {
    console.log("zone id", id)
  }

  render() {
    const {
      possessionLimits,
      timeRestrictions,
      legalPurchaseAge,
      zoneRestrictions,
      permitRules,
      selectedStateIdx,
      selectedStateName
    } = this.state
    const noRules = possessionLimits.length === 0
      && timeRestrictions.length === 0
      && zoneRestrictions.length === 0
      && permitRules.length === 0

    return (
      <div id="rule-engine">
        <PageHeader pageName="Rules" />
        <div className="wrapper">
          <Label>Excise Department</Label>
          <div style={{ display: 'flex' }}>
            <Select
              options={this.state.stateList}
              name="State"
              onChange={e => this.handleChange(e)}
              value={this.state.selectedStateIdx}
            />
            <div style={{ marginLeft: '10px' }}>
              <Button primary onClick={this.fetchRules}>View</Button>
            </div>
          </div>
        </div>
        <div className="wrapper">
          <p className="title">Rules {selectedStateIdx !== -1 ? `| ${selectedStateName}` : ""}</p>
          <RuleHeader
            title="CUSTOMER RESTRICTIONS"
            tooltipText="User/customer needs to fulfil the following criteria to place an order"
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <div>
                <div className="legal-age">
                  <Label
                    icon="info"
                    tooltipText="Minimum legal age limit to place an order"
                  >
                    Legal Purchage Age
                </Label>
                  <input type="number" value={legalPurchaseAge} />
                </div>

                <div className="possession" style={{ marginTop: '20px' }}>
                  <Label
                    icon="info"
                    tooltipText="The quantity of liquor that an individual can possess at any given time"
                  >
                    Possession Limits
                </Label>
                  {
                    possessionLimits.map((item, i) => {
                      return <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <p>{item.brand_type}</p>
                        <input className="small" type="text" value={item.volume_limit} />
                      </div>
                    })
                  }
                </div>
              </div>
            </div>
          </RuleHeader>

          <RuleHeader
            title="PERMIT RULES"
            tooltipText="Fulfiling certain criteria while generating a permit"
          >
            <div style={{ display: 'inline-block', marginRight: '20px' }} className="permit-time-validity">
              <Label
                icon="info"
                tooltipText="The validity of a single OTTP generated per order"
              >
                Permit Time Validity
            </Label>
              <input
                type="text"
                value={`${permitRules.permit_time} mins`}
              />
            </div>
            <div style={{ display: 'inline-block' }} className="cost">
              <Label
                icon="info"
                tooltipText="The amount charged per OTTP per order"
              >
                Cost/Permit
            </Label>
              <input
                type="text"
                className="small"
                value={`₹ ${permitRules.permit_cost}`}
              />
            </div>
            <div className="late-fee" style={{ marginTop: '20px' }}>
              <Label
                icon="info"
                tooltipText="In case of extension, late fee is charged per OTTP per order"
              >
                Late Fee
            </Label>
              <input
                type="text"
                className="small"
                value={`₹ ${permitRules.late_fee}`}
              />
            </div>
          </RuleHeader>

          <RuleHeader
            title="TIME RESTRICTIONS"
            tooltipText="The time range within which the delivery is active every day"
          >
            <div>
              <Label>Daily Restrictions</Label>
            </div>
            {
              timeRestrictions.map((item, i) => {
                return <div style={{ display: 'flex', alignItems: 'center' }} key={i}>
                  <p style={{ width: '110px' }}>{item.weekday_name}</p>
                  <input
                    style={{ margin: '0 20px 10px 0' }}
                    className="small" type="text"
                    value={moment(item.start_time).format('h:mm a')}
                  />
                  <p>to</p>
                  <input
                    style={{ margin: '0 0 10px 20px' }}
                    className="small"
                    type="text"
                    value={moment(item.end_time).format('h:mm a')}
                  />
                </div>
              })
            }
          </RuleHeader>
          <RuleHeader
            title="SPECIAL RESTRICTIONS"
            tooltipText="To restrict delivery with 48 hour intimation on certain days due to emergencies, as listed by the state"
          >
            <table>
              <thead>
                <tr>
                  <th><Label>Zone</Label></th>
                  <th><Label>On</Label></th>
                  <th><Label>From</Label></th>
                  <th><Label>To</Label></th>
                  <th><Label>Repeat</Label></th>
                  <th><Label>Reason</Label></th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {
                  zoneRestrictions.map((item, i) => {
                    return (
                      <tr onClick={() => this.updateZoneRestrictions(`${item.city_id !== undefined ? `city_${item.id}` : `state_${item.id}`}`)} key={i}>
                        <td>{item.city ? item.city : item.state}</td>
                        <td>{moment(item.date).format('DD/MM/YYYY')}</td>
                        <td>{moment(item.from_time).format('h:mm a')}</td>
                        <td>{moment(item.to_time).format('h:mm a')}</td>
                        <td>{item.is_repeat ? 'Yearly' : 'No'}</td>
                        <td>{item.reason}</td>
                      </tr>
                    )
                  })
                }
              </tbody>
            </table>
          </RuleHeader>
        </div>
        {
          noRules &&
          <div className="wrapper no-rules">
            <span>No rules set for {selectedStateName}</span>
            <Button custom
              icon="addWhiteIcon"
            //onClick={handleClick}
            >
              Set Rules
            </Button>
          </div>
        }
      </div>
    )
  }
}

export default RuleManagement

// const days = [
//   { value: 1, label: 'Monday' },
//   { value: 2, label: 'Tuesday' },
//   { value: 3, label: 'Wednesday' },
//   { value: 4, label: 'Thursday' },
//   { value: 5, label: 'Friday' },
//   { value: 6, label: 'Saturday' },
//   { value: 7, label: 'Sunday' }
// ]
// const RuleManagement = () => {
//   const [timeRestrictions, setTimeRestrictions] = useState([])
//   const [zoneRestrictions, setZoneRestrictions] = useState([])
//   const [possessionLimits, setPossessionLimits] = useState([])
//   const [legalPurchaseAge, setLegalPurchaseAge] = useState("")
//   const [permitRules, setPermitRules] = useState({})
//   const [] = useState

//   useEffect(() => {
//     Api.fetchRules({
//       state_id: 1
//     })
//       .then((response) => {

//         formatResponse()
//       })
//       .catch((err) => {
//         console.log("Error in fetching rule list", err)
//       })
//   }, [])

//   const formatResponse = () => {
//     const timeRestrictions = this.props.rulesData.time_restrictions.map((item) => {
//       return { ...item, weekday_name: this.days.find(dayItem => dayItem.value === item.weekday_id).label }
//     })
//     this.setState({
//       timeRestrictions: timeRestrictions,
//       legalPurchaseAge: this.props.rulesData.consumer_min_age,
//       possessionLimits: this.props.rulesData.possession_limit,
//       permitRules: this.props.rulesData.permit_rules,
//       zoneRestrictions: this.props.rulesData.city_special_days.concat(this.props.rulesData.state_special_days)
//     })
//   }

//   return (
//     <div id="rule-engine">
//       <PageHeader pageName="Rule Engine" />
//       <div style={{
//         background: '#fff',
//         margin: '20px 60px',
//         padding: '60px'
//       }}>
//         <Collpasible
//           title="CUSTOMER RESTRICTIONS"
//           tooltipText="User/customer needs to fulfil the following criteria to place an order"
//         >
//           <div style={{ display: 'flex', alignItems: 'center' }}>
//             <div>
//               <div className="legal-age">
//                 <Label
//                   icon="info"
//                   tooltipText="Minimum legal age limit to place an order"
//                 >
//                   Legal Purchage Age
//             </Label>
//                 <input type="number" value={legalPurchaseAge} />
//               </div>

//               <div className="possession" style={{ marginTop: '20px' }}>
//                 <Label
//                   icon="info"
//                   tooltipText="The quantity of liquor that an individual can possess at any given time"
//                 >
//                   Possession Limits
//             </Label>
//                 {
//                   possessionLimits.map((item, i) => {
//                     return <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
//                       <p>{item.brand_type}</p>
//                       <input className="small" type="text" value={item.volume_limit} />
//                     </div>
//                   })
//                 }
//               </div>
//             </div>
//           </div>
//         </Collpasible>

//         <Collpasible
//           title="PERMIT RULES"
//           tooltipText="Fulfiling certain criteria while generating a permit"
//         >
//           <div style={{ display: 'inline-block', marginRight: '20px' }} className="permit-time-validity">
//             <Label
//               icon="info"
//               tooltipText="The validity of a single OTTP generated per order"
//             >
//               Permit Time Validity
//         </Label>
//             <input
//               type="text"
//               value={`${permitRules.permit_time} mins`}
//             />
//           </div>
//           <div style={{ display: 'inline-block' }} className="cost">
//             <Label
//               icon="info"
//               tooltipText="The amount charged per OTTP per order"
//             >
//               Cost/Permit
//         </Label>
//             <input
//               type="text"
//               className="small"
//               value={`₹ ${permitRules.permit_cost}`}
//             />
//           </div>
//           <div className="late-fee" style={{ marginTop: '20px' }}>
//             <Label
//               icon="info"
//               tooltipText="In case of extension, late fee is charged per OTTP per order"
//             >
//               Late Fee
//         </Label>
//             <input
//               type="text"
//               className="small"
//               value={`₹ ${permitRules.late_fee}`}
//             />
//           </div>
//         </Collpasible>

//         <Collpasible
//           title="TIME RESTRICTIONS"
//           tooltipText="The time range within which the delivery is active every day"
//         >
//           <div>
//             <Label>Daily Restrictions</Label>
//           </div>
//           {
//             timeRestrictions.map((item, i) => {
//               return <div style={{ display: 'flex', alignItems: 'center' }} key={i}>
//                 <p style={{ width: '110px' }}>{item.weekday_name}</p>
//                 <input
//                   style={{ margin: '0 20px 10px 0' }}
//                   className="small" type="text"
//                   value={moment(item.start_time).format('h:mm a')}
//                 />
//                 <p>to</p>
//                 <input
//                   style={{ margin: '0 0 10px 20px' }}
//                   className="small"
//                   type="text"
//                   value={moment(item.end_time).format('h:mm a')}
//                 />
//               </div>
//             })
//           }
//         </Collpasible>
//         <Collpasible
//           title="SPECIAL RESTRICTIONS"
//           tooltipText="To restrict delivery with 48 hour intimation on certain days due to emergencies, as listed by the state"
//         >
//           <table>
//             <thead>
//               <tr>
//                 <th><Label>Zone</Label></th>
//                 <th><Label>On</Label></th>
//                 <th><Label>From</Label></th>
//                 <th><Label>To</Label></th>
//                 <th><Label>Repeat</Label></th>
//                 <th><Label>Reason</Label></th>
//                 <th></th>
//               </tr>
//             </thead>
//             <tbody>
//               {
//                 zoneRestrictions.map((item, i) => {
//                   return (
//                     <tr onClick={() => this.updateZoneRestrictions(`${item.city_id !== undefined ? `city_${item.id}` : `state_${item.id}`}`)} key={i}>
//                       <td>{item.city ? item.city : item.state}</td>
//                       <td>{moment(item.date).format('DD/MM/YYYY')}</td>
//                       <td>{moment(item.from_time).format('h:mm a')}</td>
//                       <td>{moment(item.to_time).format('h:mm a')}</td>
//                       <td>{item.is_repeat ? 'Yearly' : 'No'}</td>
//                       <td>{item.reason}</td>
//                     </tr>
//                   )
//                 })
//               }
//             </tbody>
//           </table>
//         </Collpasible>
//       </div>
//     </div>
//   )
// }
// export default RuleManagement