import { H3 } from '@/components/h3';
import { H4 } from '@/components/h4';
import AppLayout from '@/layouts/app-layout';
import {runescape} from '@/routes';
import { type BreadcrumbItem } from '@/types';
import {Head} from '@inertiajs/react';
import {Dot, LoaderCircle, X} from "lucide-react";
import AppLogo from "@/components/app-logo";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Item, ItemActions,
    ItemContent,
    ItemDescription, ItemGroup,
    ItemMedia,
    ItemSeparator,
    ItemTitle
} from "@/components/ui/item";
import {
    Empty,
    EmptyContent,
} from "@/components/ui/empty"
import {useState, useEffect} from "react";
import {ScrollArea} from "@/components/ui/scroll-area";
import {PredictionGraph} from "@/components/prediction-graph";
import Combobox from "@/components/combobox-12";

const breadcrumbs: BreadcrumbItem[] = [
    {
        title: 'Runescape',
        href: runescape().url,
    },
];

// Define types
interface ApiItem {
    value: string;
    label: string;
}

interface ItemDetail {
    id: number;
    name: string;
    description: string;
    icon: string;
    type: string;
}

interface PredictionData {
    date: string;
    [key: string]: number | string;
}

interface GraphDataPoint {
    date: string;
    [key: string]: number | string;
}

export default function Runescape() {
    // State variables for Price Prediction section
    const [pricePredictPeriod, setPricePredictPeriod] = useState("30");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [items, setItems] = useState<ApiItem[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [selectedItemsData, setSelectedItemsData] = useState<ItemDetail[]>([]);
    const [loadingItemDetails, setLoadingItemDetails] = useState(false);
    const [graphData, setGraphData] = useState<GraphDataPoint[]>([]);
    const [loadingGraph, setLoadingGraph] = useState(false);
    const [predictionsData, setPredictionsData] = useState<{[key: string]: PredictionData[]}>({});
    const [showMaxItemsWarning, setShowMaxItemsWarning] = useState(false);

    // State variables for other sections
    const [averagePricePeriod, setAveragePricePeriod] = useState("day1");
    const [loadingAveragePrices, setLoadingAveragePrices] = useState(false);
    const [averagePricesData, setAveragePricesData] = useState<any[]>([]);

    // Hardcoded historical data (13 days before today)
    const data = [
        { date: "2025-12-01", "10006": 385, "10007": 320, "10008": 324, "10009": 213 },
        { date: "2025-12-02", "10006": 438, "10007": 480, "10008": 280, "10009": 190 },
        { date: "2025-12-03", "10006": 155, "10007": 200, "10008": 310, "10009": 245 },
        { date: "2025-12-04", "10006": 92, "10007": 150, "10008": 265, "10009": 180 },
        { date: "2025-12-05", "10006": 492, "10007": 420, "10008": 390, "10009": 350 },
        { date: "2025-12-06", "10006": 81, "10007": 130, "10008": 175, "10009": 160 },
        { date: "2025-12-07", "10006": 426, "10007": 380, "10008": 410, "10009": 320 },
        { date: "2025-12-08", "10006": 307, "10007": 350, "10008": 295, "10009": 280 },
        { date: "2025-12-09", "10006": 371, "10007": 310, "10008": 340, "10009": 290 },
        { date: "2025-12-10", "10006": 475, "10007": 520, "10008": 450, "10009": 480 },
        { date: "2025-12-11", "10006": 107, "10007": 170, "10008": 190, "10009": 150 },
        { date: "2025-12-12", "10006": 341, "10007": 290, "10008": 315, "10009": 270 },
        { date: "2025-12-13", "10006": 408, "10007": 450, "10008": 425, "10009": 390 },
    ];

    // 1. Fetch items from API (Requirement #2)
    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoadingItems(true);
                const response = await fetch('/api/runescape/items');

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();
                setItems(data);
            } catch (error) {
                console.error('Failed to fetch items:', error);
                setItems([]);
            } finally {
                setLoadingItems(false);
            }
        };

        fetchItems();
    }, []);

    // 3. Fetch item details when selected items change (Requirement #3)
    useEffect(() => {
        const fetchItemDetails = async () => {
            if (selectedItems.length === 0) {
                setSelectedItemsData([]);
                return;
            }

            setLoadingItemDetails(true);
            try {
                const promises = selectedItems.map(async (itemId) => {
                    const response = await fetch(`/api/runescape/items/${itemId}`);
                    if (!response.ok) {
                        throw new Error(`Failed to fetch item ${itemId}`);
                    }
                    return response.json();
                });

                const itemDetails = await Promise.all(promises);
                setSelectedItemsData(itemDetails);
            } catch (error) {
                console.error('Failed to fetch item details:', error);
            } finally {
                setLoadingItemDetails(false);
            }
        };

        fetchItemDetails();
    }, [selectedItems]);

    // 6. Fetch predictions when selected items or period changes (Requirement #6)
    useEffect(() => {
        const fetchPredictions = async () => {
            if (selectedItems.length === 0) {
                setPredictionsData({});
                return;
            }

            setLoadingGraph(true);
            try {
                const promises = selectedItems.map(async (itemId) => {
                    const response = await fetch(
                        `/api/runescape/predictions/${itemId}?period=${pricePredictPeriod}`
                    );
                    if (!response.ok) {
                        throw new Error(`Failed to fetch predictions for item ${itemId}`);
                    }
                    return { itemId: itemId.toString(), data: await response.json() };
                });

                const results = await Promise.all(promises);

                // Store predictions by item ID
                const newPredictionsData: {[key: string]: PredictionData[]} = {};
                results.forEach(result => {
                    newPredictionsData[result.itemId] = result.data;
                });

                setPredictionsData(newPredictionsData);
            } catch (error) {
                console.error('Failed to fetch predictions:', error);
                setPredictionsData({});
            } finally {
                setLoadingGraph(false);
            }
        };

        fetchPredictions();
    }, [selectedItems, pricePredictPeriod]);

    // Fetch average prices data
    useEffect(() => {
        const fetchAveragePrices = async () => {
            setLoadingAveragePrices(true);
            try {
                // Simulate API call delay
                await new Promise(resolve => setTimeout(resolve, 1000));

                // In real app, you would fetch from API:
                // const response = await fetch(`/api/runescape/average-prices?period=${averagePricePeriod}`);
                // const data = await response.json();
                // setAveragePricesData(data);

                // For now, use empty array to show loading state
                setAveragePricesData([]);
            } catch (error) {
                console.error('Failed to fetch average prices:', error);
                setAveragePricesData([]);
            } finally {
                setLoadingAveragePrices(false);
            }
        };

        fetchAveragePrices();
    }, [averagePricePeriod]);

    // Combine hardcoded data with API predictions for graph
    useEffect(() => {
        if (selectedItems.length === 0 || Object.keys(predictionsData).length === 0) {
            // If no predictions yet, use historical data for selected items
            const filteredHistoricalData = data.map(dataPoint => {
                const newDataPoint: GraphDataPoint = { date: dataPoint.date };
                selectedItems.forEach(itemId => {
                    const itemIdStr = itemId.toString();
                    if (itemIdStr in dataPoint) {
                        newDataPoint[itemIdStr] = dataPoint[itemIdStr as keyof typeof dataPoint] as number;
                    } else {
                        const baseValue = 100 + (Math.random() * 400);
                        newDataPoint[itemIdStr] = Math.round(baseValue);
                    }
                });
                return newDataPoint;
            });
            setGraphData(filteredHistoricalData);
            return;
        }

        // Combine hardcoded historical data with API predictions
        const combinedData: GraphDataPoint[] = [];

        data.forEach(historicalPoint => {
            const combinedPoint: GraphDataPoint = { date: historicalPoint.date };

            selectedItems.forEach(itemId => {
                const itemIdStr = itemId.toString();
                if (itemIdStr in historicalPoint) {
                    combinedPoint[itemIdStr] = historicalPoint[itemIdStr as keyof typeof historicalPoint] as number;
                } else {
                    const predictionForDate = predictionsData[itemIdStr]?.find(
                        pred => pred.date === historicalPoint.date
                    );
                    if (predictionForDate) {
                        combinedPoint[itemIdStr] = predictionForDate[itemIdStr];
                    } else {
                        const baseValue = 100 + (Math.random() * 400);
                        combinedPoint[itemIdStr] = Math.round(baseValue);
                    }
                }
            });

            combinedData.push(combinedPoint);
        });

        // Find all unique dates from all predictions
        const allPredictionDates = new Set<string>();
        selectedItems.forEach(itemId => {
            const itemIdStr = itemId.toString();
            predictionsData[itemIdStr]?.forEach(pred => {
                allPredictionDates.add(pred.date);
            });
        });

        const sortedDates = Array.from(allPredictionDates).sort();

        sortedDates.forEach(date => {
            if (data.some(h => h.date === date)) {
                return;
            }

            const predictionPoint: GraphDataPoint = { date };

            selectedItems.forEach(itemId => {
                const itemIdStr = itemId.toString();
                const itemPrediction = predictionsData[itemIdStr]?.find(pred => pred.date === date);

                if (itemPrediction && itemIdStr in itemPrediction) {
                    predictionPoint[itemIdStr] = itemPrediction[itemIdStr];
                } else {
                    const otherValues = selectedItems
                        .filter(id => id !== itemId)
                        .map(id => {
                            const otherPred = predictionsData[id.toString()]?.find(pred => pred.date === date);
                            return otherPred ? otherPred[id.toString()] : null;
                        })
                        .filter(val => val !== null) as number[];

                    if (otherValues.length > 0) {
                        const avg = otherValues.reduce((a, b) => a + b, 0) / otherValues.length;
                        predictionPoint[itemIdStr] = Math.round(avg);
                    } else {
                        predictionPoint[itemIdStr] = 10000;
                    }
                }
            });

            combinedData.push(predictionPoint);
        });

        setGraphData(combinedData);
    }, [selectedItems, predictionsData]);

    const handleRemoveItem = (itemId: number) => {
        setSelectedItems(prev => prev.filter(id => id !== itemId));
    };

    const handleComboboxChange = (newValues: string[]) => {
        // Convert string values to numbers
        const numericValues = newValues.map(v => Number(v)).filter(v => !isNaN(v));

        if (numericValues.length > 8) {
            // Show warning when trying to select 9th item
            setShowMaxItemsWarning(true);

            // Auto-hide the warning after 3 seconds
            setTimeout(() => {
                setShowMaxItemsWarning(false);
            }, 3000);

            // Only keep the first 8 items
            setSelectedItems(numericValues.slice(0, 8));
        } else {
            setShowMaxItemsWarning(false);
            setSelectedItems(numericValues);
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=1042";
    };

    // Convert selected items to string array for Combobox
    const selectedItemsStrings = selectedItems.map(item => item.toString());

    // Prepare items for PredictionGraph - use ApiItem format
    const getChartItems = (): ApiItem[] => {
        return selectedItemsData.map(item => ({
            value: item.id.toString(),
            label: item.name
        }));
    };

    // Helper function to filter items for other sections
    const getFilteredItems = (): ApiItem[] => {
        return items.filter(i => selectedItems.includes(Number(i.value)));
    };

    return (
        <ScrollArea className="h-screen bg-cool-gradient">
            <AppLayout breadcrumbs={breadcrumbs} data-theme="red">
                <Head title="" />
                <div className="flex h-full flex-1 flex-col gap-6 overflow-x-auto rounded-xl p-4 py-36 bg-transparent">

                    {/*Introduction*/}
                    <div className="text-center flex flex-col items-center justify-center w-full mb-32 gap-4">
                        <div className="flex items-center space-x-2">
                            <AppLogo />
                        </div>
                        <H3 className="text-pretty">
                            AI-Powered Grand Exchange Price Forecasting for <span className="text-sidebar-primary">Runescape 3</span>
                        </H3>

                        {/* Last Update Indicator */}
                        <div className="text-sm space-x-2 text-pretty">
                            Updates daily <Dot className="inline-block align-middle"/>
                            Last updated: {new Date().toLocaleString('en-PH', {
                            year: 'numeric',
                            month: 'short',
                            day: '2-digit',
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                        })}
                        </div>
                    </div>

                    {/*Price Prediction*/}
                    <div className="mt-16 flex justify-between items-center w-full">
                        <div className="flex flex-col gap-1">
                            <H4>Item Trade Price Prediction</H4>
                            <div className="flex items-center gap-2">
                                <p className="text-muted-foreground text-sm">
                                    See price history and predictions for up to 8 items at once!
                                    {selectedItems.length > 0 && ` (${selectedItems.length}/8 selected)`}
                                </p>
                                {showMaxItemsWarning && (
                                    <span className="text-xs text-amber-600 font-medium animate-in fade-in-50">
                                        • Max 8 items
                                    </span>
                                )}
                            </div>
                        </div>
                        <Select
                            value={pricePredictPeriod}
                            onValueChange={setPricePredictPeriod}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="1">Tomorrow</SelectItem>
                                <SelectItem value="7">Next week</SelectItem>
                                <SelectItem value="30">Next month</SelectItem>
                                <SelectItem value="90">Next 3 months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid auto-rows-min gap-6 md:grid-cols-3 bg-transparent">
                        <Card className="h-148">
                            <CardContent className="flex flex-col gap-6">
                                {loadingItems ? (
                                    <div className="flex items-center justify-center py-4">
                                        <LoaderCircle className="animate-spin text-primary mr-2" />
                                        <span>Loading items...</span>
                                    </div>
                                ) : (
                                    <Combobox
                                        value={selectedItemsStrings}
                                        onValueChange={handleComboboxChange}
                                        options={items}
                                        placeholder="Select items (max 8)"
                                    />
                                )}

                                <ScrollArea className="h-105 border rounded-md">
                                    {loadingItemDetails ? (
                                        <div className="h-121 flex items-center justify-center">
                                            <LoaderCircle className="animate-spin text-primary mr-2" />
                                            <span>Loading item details...</span>
                                        </div>
                                    ) : selectedItemsData.length > 0 ? (
                                        <div className="flex flex-col">
                                            <ItemGroup>
                                                {selectedItemsData.map((item, index) => (
                                                    <div key={item.id}>
                                                        <Item>
                                                            <ItemMedia variant="image">
                                                                <img
                                                                    src={item.icon}
                                                                    alt={item.name}
                                                                    className="w-10 h-10"
                                                                    onError={handleImageError}
                                                                />
                                                            </ItemMedia>
                                                            <ItemContent>
                                                                <ItemTitle className="truncate">
                                                                    {item.name}
                                                                </ItemTitle>
                                                                <ItemDescription className="truncate">
                                                                    {item.description}
                                                                </ItemDescription>
                                                            </ItemContent>
                                                            <ItemActions>
                                                                <X
                                                                    className="size-4 hover:text-primary cursor-pointer"
                                                                    onClick={() => {
                                                                        console.log('X button clicked for item:', item.id, 'item.name:', item.name);
                                                                        handleRemoveItem(item.id);
                                                                    }}
                                                                />
                                                            </ItemActions>
                                                        </Item>
                                                        {index !== selectedItemsData.length - 1 && <ItemSeparator />}
                                                    </div>
                                                ))}
                                            </ItemGroup>
                                        </div>
                                    ) : (
                                        <Empty className="h-121 text-muted-foreground">
                                            <EmptyContent>
                                                {loadingItems ? 'Loading items...' : 'No items selected'}
                                            </EmptyContent>
                                        </Empty>
                                    )}
                                </ScrollArea>
                            </CardContent>
                        </Card>
                        <Card className="md:col-span-2 flex flex-col justify-center">
                            {loadingGraph ? (
                                <Empty className="text-muted-foreground">
                                    <EmptyContent className="flex-row gap-2 items-center justify-center">
                                        <LoaderCircle className="animate-spin text-primary mb-1"/>
                                        Loading price history and predictions...
                                    </EmptyContent>
                                </Empty>
                            ) : selectedItems.length > 0 ? (
                                <>
                                    <CardHeader>
                                        <CardTitle>Item Price History and Prediction</CardTitle>
                                        <CardDescription>
                                            {pricePredictPeriod === '1' ? 'Tomorrow' :
                                                pricePredictPeriod === '7' ? 'Next Week' :
                                                    pricePredictPeriod === '30' ? 'Next Month' : 'Next 3 Months'}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PredictionGraph
                                            data={graphData}
                                            items={getChartItems()}
                                        />
                                    </CardContent>
                                </>
                            ) : (
                                <Empty className="text-muted-foreground">
                                    <EmptyContent>
                                        Select items to predict future prices
                                    </EmptyContent>
                                </Empty>
                            )}
                        </Card>
                    </div>

                    {/*Top Avrg Prices*/}
                    <div className="mt-16 flex justify-between items-center w-full">
                        <div className="flex flex-col gap-1">
                            <H4>Top Average Item Prices</H4>
                            <desc className="text-muted-foreground text-sm">See most valuable traded items by daily price average</desc>
                        </div>
                        <Select
                            value={averagePricePeriod}
                            onValueChange={setAveragePricePeriod}
                        >
                            <SelectTrigger className="w-[180px]">
                                <SelectValue placeholder="Time Period" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="day1">Today</SelectItem>
                                <SelectItem value="day7">Last week</SelectItem>
                                <SelectItem value="day30">Last month</SelectItem>
                                <SelectItem value="day90">Last 3 months</SelectItem>
                                <SelectItem value="day180">Last 6 months</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="grid auto-rows-min gap-6 md:grid-cols-3 bg-transparent">
                        {loadingAveragePrices ? (
                            <Empty className="text-muted-foreground h-148">
                                <EmptyContent className="flex-row gap-2 items-center justify-center">
                                    <LoaderCircle className="animate-spin text-primary mb-1"/> Calculating...
                                </EmptyContent>
                            </Empty>
                        ) : (
                            <ScrollArea className="h-148">
                                <div className="flex flex-col">
                                    <ItemGroup>
                                        {[1,2,3,4,5,6,7,8].map((item, index) => (
                                            <>
                                                <Item className="px-0">
                                                    <ItemTitle className="w-8">
                                                        #{index + 1}
                                                    </ItemTitle>
                                                    <ItemMedia variant="image">
                                                        <img src="https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=1042" alt="oten"/>
                                                    </ItemMedia>
                                                    <ItemContent>
                                                        <ItemTitle>
                                                            Blue Partyhat
                                                        </ItemTitle>
                                                        <ItemDescription>
                                                            A nice hat from a cracker.
                                                        </ItemDescription>
                                                    </ItemContent>
                                                    <ItemContent>
                                                        oten
                                                    </ItemContent>
                                                </Item>
                                                {(index !== [1,2,3,4,5,6,7,8].length - 1) && <ItemSeparator />}
                                            </>
                                        ))}
                                    </ItemGroup>
                                </div>
                            </ScrollArea>
                        )}

                        <Card className="md:col-span-2 flex flex-col justify-center">
                            {loadingAveragePrices ? (
                                <Empty className="text-muted-foreground">
                                    <EmptyContent className="flex-row gap-2 items-center justify-center">
                                        <LoaderCircle className="animate-spin text-primary mb-1"/> Loading price history and predictions...
                                    </EmptyContent>
                                </Empty>
                            ) : (
                                <>
                                    <CardHeader>
                                        <CardTitle>Item Price History and Prediction</CardTitle>
                                        <CardDescription>Jan 30 - Apr 30, 2025</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PredictionGraph data={data} items={getFilteredItems()} />
                                    </CardContent>
                                </>
                            )}
                        </Card>
                    </div>
                </div>
            </AppLayout>
        </ScrollArea>
    );
}
