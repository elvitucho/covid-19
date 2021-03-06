import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { lookupCountyInfo, nearbyCounties } from "./USCountyInfo.js";
import * as USCounty from "./USCountyInfo.js";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';


var shortNumber = require('short-number');

function myShortNumber(n) {
    if (!n) {
        return "0";
    }
    if (isNaN(n)) {
        n = n.replace(/,/g, '');
        n = Number(n);
    }
    return shortNumber(n);
}


const states = require('us-state-codes');

const useStyles = makeStyles(theme => ({
    row: {
        padding: theme.spacing(1, 1),
        justifyContent: "space-between",
        display: "flex",
    },
    tag: {
        display: "inline-block",
        textAlign: "center",
        backgroundColor: "#f3f3f3",
        padding: theme.spacing(1, 1),
        flex: 1,
        margin: 3,
    },
    grow: {
        flexGrow: 1,
    },
    table: {
        width: "100%"
    }
}));

const NearbyCounties = (props) => {
    let countyInfo = lookupCountyInfo(props.state, props.county);
    let countySummary = <div></div>;
    if (countyInfo) {
        let nearby =
            nearbyCounties(props.state, props.county)
                .sort((a, b) => a.distance - b.distance)
                .slice(0, 10)
            ;
        countySummary =
            <div>
                <h3> Nearby Counties of {props.county}, {states.getStateNameByStateCode(props.state)} </h3>
                <CountyListRender countylist={nearby} callback={props.callback} />
            </div>;
    }
    return countySummary;
}
const CountiesForStateWidget = (props) => {
    let countyInfo = true;
    let countySummary = <div></div>;
    if (countyInfo) {
        let list = USCounty.countyDataForState(props.state);
        countySummary =
            <div>
                <h3> Counties of {states.getStateNameByStateCode(props.state)} </h3>
                <CountyListRender countylist={list} callback={props.callback} />
            </div>;
    }
    return countySummary;
}

const AllStatesListWidget = (props) => {
    let list = USCounty.getAllStatesSummary(props.casesData)
        .sort((a, b) => b.confirmed - a.confirmed);
    let countySummary =
        <div>
            <h3> States of USA </h3>
            <AllStateListRender countylist={list} callback={props.callback} />
        </div>;
    return countySummary;
}

const AllStateListRender = (props) => {
    const list = props.countylist;
    const classes = useStyles();
    let countySummary =
        <Table className={classes.table} size="small" aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell > Name</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">New</TableCell>
                    <TableCell align="center">Population</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    list.map(row => {
                        let newcases = row.newcases;
                        let confirmed = row.confirmed;
                        let newpercent = row.newpercent;
                        let newEntry = (Number.isNaN(newpercent)) ? newcases : `${newcases}(+${newpercent}%)`;
                        if (newcases === 0) {
                            newEntry = 0;
                        }
                        let statename = states.getStateNameByStateCode(row.state);
                        if (!statename) {
                            statename = row.state;
                        }
                        let pop = row.Population2010 ? row.Population2010 : 0;
                        return <TableRow key={statename}>
                            <TableCell component="th" scope="row" onClick={() => {
                                props.callback(row.state)
                            }}>
                                {statename}
                            </TableCell>
                            <TableCell align="center">{confirmed}</TableCell>
                            <TableCell align="center"> {newEntry} </TableCell>
                            <TableCell align="center">{myShortNumber(pop)}</TableCell>
                        </TableRow>;
                    })
                }
            </TableBody>
        </Table>;
    return countySummary;
};

const CountyListRender = (props) => {
    const list = props.countylist;
    const classes = useStyles();
    function clicked(newcounty, newstate) {
        if (props.callback) {
            props.callback(newcounty, newstate);
        }
    }
    let countySummary =
        <Table className={classes.table} size="small" aria-label="simple table">
            <TableHead>
                <TableRow>
                    <TableCell > Name</TableCell>
                    <TableCell align="center">Total</TableCell>
                    <TableCell align="center">New</TableCell>
                    <TableCell align="center">Population</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    list.map(row => {
                        let sum = USCounty.casesForCountySummary(row.State, row.County);
                        let newcases = sum.newcases;
                        let confirmed = sum.confirmed;
                        let newpercent = sum.newpercent;
                        let newEntry = (Number.isNaN(newpercent)) ? newcases : `${newcases}(+${newpercent}%)`;
                        if (newcases === 0) {
                            newEntry = 0;
                        }
                        return <TableRow key={row.County}>
                            <TableCell component="th" scope="row" onClick={() => { clicked(row.County, row.State); }}>
                                {row.County}
                            </TableCell>
                            <TableCell align="center">{confirmed}</TableCell>
                            <TableCell align="center"> {newEntry} </TableCell>
                            <TableCell align="center">{myShortNumber(row.Population2010)}</TableCell>
                        </TableRow>;
                    })
                }
            </TableBody>
        </Table>;
    return countySummary;
}

export {
    NearbyCounties,
    CountiesForStateWidget,
    AllStatesListWidget,
}