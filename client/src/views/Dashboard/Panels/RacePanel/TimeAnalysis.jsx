import React, { useState } from "react";
import {
    HStack,
    Box,
    VStack,
    Table,
    Thead,
    Tbody,
    Tr,
    Th,
    Td,
    TableContainer,
    Button,
} from "@chakra-ui/react";
import { ParamSlider } from "../../../../components/Forms";
import { LinePlusColumnChart, StatCard } from "../../../../components/StructuredData";

const colorPalette = ["pink", "green", "blue", "red"];

const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

// Calculate summary data for table.
const calculateTableData = data => {
    return {
        distance: data["dist"].at(-1),
        "avg speed": avg(data["speed"]).toFixed(2),
        "avg power": avg(data["power_net"]).toFixed(2),
    };
};

// create data for combined variwide, area, line graph
const generateTimeAnalysisSeries = (dataOriginal, dataAdjusted) => {
    // if no adjusted data, graph only elevation data
    if (dataAdjusted === undefined) {
        return {
            variwide: null,
            elevation: dataOriginal["dist"].map((d, i) => {
                return [d, dataOriginal["elevation"][i]];
            }),
            cumulativeEffect: null,
        };
    }

    const segnums = [...new Set(dataOriginal["segment"])];

    // find indexes where segments start
    const calcSegIdxs = (data, segnums) => {
        return segnums
            .map(segnum => {
                return data["segment"].indexOf(segnum);
            })
            .concat([data["segment"].length - 1]);
    };

    const segIdxsOriginal = calcSegIdxs(dataOriginal, segnums);
    const segIdxsAdjusted = calcSegIdxs(dataAdjusted, segnums);

    // calculate the different in segment times between original and adjusted dataset
    const segDurationChange = [];
    const segDistances = [];
    const cumulativeEffect = [0];
    for (let i = 1; i < segIdxsOriginal.length; i++) {
        const segDurationOriginal =
            dataOriginal["time"][segIdxsOriginal[i]] -
            dataOriginal["time"][segIdxsOriginal[i - 1]];
        const segDurationAdjusted =
            dataAdjusted["time"][segIdxsAdjusted[i]] -
            dataAdjusted["time"][segIdxsAdjusted[i - 1]];
        const durationDelta = segDurationAdjusted - segDurationOriginal;
        segDurationChange.push(durationDelta);
        cumulativeEffect.push([dataOriginal["dist"][segIdxsOriginal[i]], durationDelta]);
        segDistances.push(
            dataOriginal["dist"][segIdxsOriginal[i]] -
                dataOriginal["dist"][segIdxsOriginal[i - 1]]
        );
    }

    const variwideData = segnums.map((segnum, i) => {
        return [`segment ${segnum}`, segDurationChange[i], segDistances[i]];
    });
    return {
        variwide: variwideData,
        elevation: dataOriginal["dist"].map((d, i) => {
            return [d, dataOriginal["elevation"][i]];
        }),
        cumulativeEffect: cumulativeEffect,
    };
};

// xxxxx -> xx:xx:xx
const convertSeconds = secs => {
    return new Date(secs * 1000).toISOString().substring(11, 19);
};

const TimeAnalysis = ({
    dataOriginal,
    dataAdjusted,
    adjustParameters,
    setAdjustParameters,
}) => {
    const [tableData, setTableData] = useState({
        original: calculateTableData(dataOriginal),
        adjusted: dataAdjusted ? calculateTableData(dataAdjusted) : null,
    });
    // Our raw data to pass to our graph component.
    const [timeAnalysisSeries, setTimeAnalysisSeries] = useState(
        generateTimeAnalysisSeries(dataOriginal, dataAdjusted)
    );
    // Initialise time stats.
    const [adjustedTime, setAdjustedTime] = useState(
        dataAdjusted != null ? convertSeconds(dataAdjusted["time"].at(-1)) : "-"
    );
    const [originalTime, setOriginalTime] = useState(
        convertSeconds(dataOriginal["time"].at(-1))
    );
    const [timeDelta, setTimeDelta] = React.useState(
        adjustedTime !== "-"
            ? convertSeconds(dataAdjusted["time"].at(-1) - dataOriginal["time"].at(-1))
            : "-"
    );

    return (
        <VStack w="100%" spacing={6} alignItems="center">
            <LinePlusColumnChart data={timeAnalysisSeries} width={1200} height={600} />
            <HStack spacing={6}>
                {Object.keys(adjustParameters).map((p, i) => {
                    return (
                        <ParamSlider
                            key={p}
                            paramName={p}
                            color={colorPalette[i]}
                            onChange={val =>
                                setAdjustParameters({
                                    ...adjustParameters,
                                    [p]: val,
                                })
                            }
                            sliderValue={adjustParameters[p]}
                        />
                    );
                })}
            </HStack>
            <Button colorScheme="yellow" onClick={() => console.log(adjustParameters)}>
                Submit
            </Button>
            <HStack
                w="100%"
                spacing={6}
                alignItems="center"
                justifyContent="space-between"
            >
                <StatCard title="Original Time" noArrow={true}>
                    {originalTime}
                </StatCard>
                <StatCard title="Adjusted Time" noArrow={true}>
                    {adjustedTime}
                </StatCard>
                <StatCard title="Total Delta" noArrow={true}>
                    {timeDelta}
                </StatCard>
            </HStack>
            <TableContainer w="100%" border="1px" borderColor="gray.300" rounded="md">
                <Table w="100%" variant="striped">
                    <Thead>
                        <Tr>
                            <Th></Th>
                            <Th> Original </Th>
                            {tableData["adjusted"] != null ? <Th> Adjusted </Th> : null}
                        </Tr>
                    </Thead>
                    <Tbody>
                        {Object.keys(tableData["original"]).map(k => {
                            return (
                                <Tr>
                                    <Td>{k}</Td>
                                    <Td>{tableData["original"][k]}</Td>
                                    {tableData["adjusted"] != null ? (
                                        <Td>{tableData["adjusted"][k]}</Td>
                                    ) : null}
                                </Tr>
                            );
                        })}
                    </Tbody>
                </Table>
            </TableContainer>
            {/* </VStack> */}
        </VStack>
    );
};

export default TimeAnalysis;
