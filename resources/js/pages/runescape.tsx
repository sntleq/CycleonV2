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

interface RankingItem {
    id: string;
    price: number;
}

interface VolumeItem {
    id: string;
    volume: number;
}

// Add interface for Last Update response
interface LastUpdateInfo {
    timestamp?: string;
    formatted_date?: string;
    rs_timestamp?: string;
    success?: boolean;
    error?: string;
    message?: string;
}

export default function Runescape() {
    // State variables for Price Prediction section
    const [pricePredictPeriod, setPricePredictPeriod] = useState("30");
    const [selectedItems, setSelectedItems] = useState<number[]>([]);
    const [items, setItems] = useState<ApiItem[]>([]);
    const [loadingItems, setLoadingItems] = useState(true);
    const [selectedItemsData, setSelectedItemsData] = useState<ItemDetail[]>([]);
    const [loadingItemDetails, setLoadingItemDetails] = useState<{[key: number]: boolean}>({});
    const [graphData, setGraphData] = useState<GraphDataPoint[]>([]);
    const [loadingGraph, setLoadingGraph] = useState(false);
    const [predictionsData, setPredictionsData] = useState<{[key: string]: PredictionData[]}>({});
    const [showMaxItemsWarning, setShowMaxItemsWarning] = useState(false);

    // State variables for Top Average Prices section
    const [averagePricePeriod, setAveragePricePeriod] = useState("day1");
    const [loadingAveragePrices, setLoadingAveragePrices] = useState(false);
    const [averagePricesData, setAveragePricesData] = useState<RankingItem[]>([]);
    const [rankingItemsDetails, setRankingItemsDetails] = useState<ItemDetail[]>([]);
    const [loadingRankingDetails, setLoadingRankingDetails] = useState(false);
    const [rankingGraphData, setRankingGraphData] = useState<GraphDataPoint[]>([]);
    const [loadingRankingGraph, setLoadingRankingGraph] = useState(false);

    // State variables for Top Item Trades section
    const [topTradesPeriod, setTopTradesPeriod] = useState("day1");
    const [loadingTopTrades, setLoadingTopTrades] = useState(false);
    const [topTradesData, setTopTradesData] = useState<VolumeItem[]>([]);
    const [topTradesItemsDetails, setTopTradesItemsDetails] = useState<ItemDetail[]>([]);
    const [loadingTopTradesDetails, setLoadingTopTradesDetails] = useState(false);
    const [topTradesGraphData, setTopTradesGraphData] = useState<GraphDataPoint[]>([]);
    const [loadingTopTradesGraph, setLoadingTopTradesGraph] = useState(false);

    // State variable for Last Update Date
    const [lastUpdate, setLastUpdate] = useState<string | null>(null);
    const [loadingLastUpdate, setLoadingLastUpdate] = useState(true);
    const [lastUpdateError, setLastUpdateError] = useState(false);

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

    // ========== FETCH LAST UPDATE DATE ==========
    useEffect(() => {
        const fetchLastUpdate = async () => {
            try {
                setLoadingLastUpdate(true);
                setLastUpdateError(false);

                // Use our proxy endpoint
                const response = await fetch('/api/runescape/last-update');

                if (!response.ok) {
                    throw new Error(`Failed to fetch last update: ${response.status}`);
                }

                const data: LastUpdateInfo = await response.json();
                // Use the formatted date from the API
                setLastUpdate(data.formatted_date || 'N/A');
            } catch (error) {
                console.error('Failed to fetch last update:', error);
                setLastUpdateError(true);
                // Fallback to current time
                const now = new Date();
                const month = String(now.getMonth() + 1).padStart(2, '0');
                const day = String(now.getDate()).padStart(2, '0');
                const year = String(now.getFullYear()).slice(-2);
                const hours = now.getHours();
                const minutes = String(now.getMinutes()).padStart(2, '0');
                const ampm = hours >= 12 ? 'PM' : 'AM';
                const formattedHours = hours % 12 || 12;

                const formattedDate = `${month}/${day}/${year} ${formattedHours}:${minutes} ${ampm} (approx)`;
                setLastUpdate(formattedDate);
            } finally {
                setLoadingLastUpdate(false);
            }
        };

        fetchLastUpdate();

        const interval = setInterval(() => {
            fetchLastUpdate();
        }, 5 * 60 * 1000); // Update every 5 minutes

        return () => clearInterval(interval);
    }, []);

    // ========== PRICE PREDICTION SECTION FUNCTIONS ==========
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

    // Loading state in item
    useEffect(() => {
        const fetchNewItemDetails = async () => {
            const existingIds = new Set(selectedItemsData.map(item => item.id));
            const newItems = selectedItems.filter(id => !existingIds.has(id));

            if (newItems.length === 0) return;

            // Set loading states for new items
            const newLoadingStates = {...loadingItemDetails};
            newItems.forEach(id => {
                newLoadingStates[id] = true;
            });
            setLoadingItemDetails(newLoadingStates);

            try {
                const promises = newItems.map(async (itemId) => {
                    try {
                        const response = await fetch(`/api/runescape/items/${itemId}`);
                        if (!response.ok) {
                            throw new Error(`Failed to fetch item ${itemId}`);
                        }
                        return response.json();
                    } catch (error) {
                        console.error(`Failed to fetch item ${itemId}:`, error);
                        return null;
                    }
                });

                const newItemDetails = await Promise.all(promises);

                const validNewItems = newItemDetails.filter(item => item !== null) as ItemDetail[];
                setSelectedItemsData(prev => [...prev, ...validNewItems]);

                const updatedLoadingStates = {...loadingItemDetails};
                newItems.forEach(id => {
                    updatedLoadingStates[id] = false;
                });
                setLoadingItemDetails(updatedLoadingStates);
            } catch (error) {
                console.error('Failed to fetch new item details:', error);
                const errorLoadingStates = {...loadingItemDetails};
                newItems.forEach(id => {
                    errorLoadingStates[id] = false;
                });
                setLoadingItemDetails(errorLoadingStates);
            }
        };

        fetchNewItemDetails();
    }, [selectedItems]);

    // Remove items from selectedItemsData when they're removed from selectedItems
    useEffect(() => {
        const existingIds = new Set(selectedItems);
        const filteredData = selectedItemsData.filter(item => existingIds.has(item.id));

        if (filteredData.length !== selectedItemsData.length) {
            setSelectedItemsData(filteredData);

            const filteredLoadingStates = {...loadingItemDetails};
            Object.keys(filteredLoadingStates).forEach(key => {
                const id = parseInt(key);
                if (!existingIds.has(id)) {
                    delete filteredLoadingStates[id];
                }
            });
            setLoadingItemDetails(filteredLoadingStates);
        }
    }, [selectedItems, selectedItemsData.length]);

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

    useEffect(() => {
        if (selectedItems.length === 0 || Object.keys(predictionsData).length === 0) {
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

    // ========== TOP AVERAGE PRICES SECTION FUNCTIONS ==========
    useEffect(() => {
        const fetchAveragePrices = async () => {
            try {
                setLoadingAveragePrices(true);
                const response = await fetch(`/api/runescape/rankings?n=10`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const rankingsData = await response.json();
                setAveragePricesData(rankingsData);
            } catch (error) {
                console.error('Failed to fetch average prices:', error);
                setAveragePricesData([]);
            } finally {
                setLoadingAveragePrices(false);
            }
        };

        fetchAveragePrices();
    }, [averagePricePeriod]);

    useEffect(() => {
        const fetchRankingItemDetails = async () => {
            if (averagePricesData.length === 0) {
                setRankingItemsDetails([]);
                return;
            }

            setLoadingRankingDetails(true);
            try {
                const promises = averagePricesData.map(async (item) => {
                    try {
                        const response = await fetch(`/api/runescape/items/${item.id}`);
                        if (!response.ok) {
                            console.warn(`Failed to fetch item ${item.id}, status: ${response.status}`);
                            return {
                                id: parseInt(item.id),
                                name: `Item ${item.id}`,
                                description: 'Description not available',
                                icon: `https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=${item.id}`,
                                type: 'Unknown'
                            };
                        }
                        const itemData = await response.json();
                        return itemData;
                    } catch (error) {
                        console.error(`Error fetching item ${item.id}:`, error);
                        return {
                            id: parseInt(item.id),
                            name: `Item ${item.id}`,
                            description: 'Description not available',
                            icon: `https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=${item.id}`,
                            type: 'Unknown'
                        };
                    }
                });

                const itemDetails = await Promise.all(promises);
                setRankingItemsDetails(itemDetails);
            } catch (error) {
                console.error('Failed to fetch ranking item details:', error);
                const fallbackItems = averagePricesData.map(item => ({
                    id: parseInt(item.id),
                    name: `Item ${item.id}`,
                    description: 'Description not available',
                    icon: `https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=${item.id}`,
                    type: 'Unknown'
                }));
                setRankingItemsDetails(fallbackItems);
            } finally {
                setLoadingRankingDetails(false);
            }
        };

        fetchRankingItemDetails();
    }, [averagePricesData]);

    // ========== TOP ITEM TRADES SECTION FUNCTIONS ==========
    useEffect(() => {
        const fetchTopTrades = async () => {
            try {
                setLoadingTopTrades(true);
                const response = await fetch(`/api/runescape/top-trades?n=10`);

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const tradesData = await response.json();
                setTopTradesData(tradesData);
            } catch (error) {
                console.error('Failed to fetch top trades:', error);
                setTopTradesData([]);
            } finally {
                setLoadingTopTrades(false);
            }
        };

        fetchTopTrades();
    }, [topTradesPeriod]);

    useEffect(() => {
        const fetchTopTradesItemDetails = async () => {
            if (topTradesData.length === 0) {
                setTopTradesItemsDetails([]);
                return;
            }

            setLoadingTopTradesDetails(true);
            try {
                const promises = topTradesData.map(async (item) => {
                    try {
                        const response = await fetch(`/api/runescape/items/${item.id}`);
                        if (!response.ok) {
                            console.warn(`Failed to fetch item ${item.id}, status: ${response.status}`);
                            return {
                                id: parseInt(item.id),
                                name: `Item ${item.id}`,
                                description: 'Description not available',
                                icon: `https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=${item.id}`,
                                type: 'Unknown'
                            };
                        }
                        const itemData = await response.json();
                        return itemData;
                    } catch (error) {
                        console.error(`Error fetching item ${item.id}:`, error);
                        return {
                            id: parseInt(item.id),
                            name: `Item ${item.id}`,
                            description: 'Description not available',
                            icon: `https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=${item.id}`,
                            type: 'Unknown'
                        };
                    }
                });

                const itemDetails = await Promise.all(promises);
                setTopTradesItemsDetails(itemDetails);
            } catch (error) {
                console.error('Failed to fetch top trades item details:', error);
                const fallbackItems = topTradesData.map(item => ({
                    id: parseInt(item.id),
                    name: `Item ${item.id}`,
                    description: 'Description not available',
                    icon: `https://secure.runescape.com/m=itemdb_rs/1765192585985_obj_sprite.gif?id=${item.id}`,
                    type: 'Unknown'
                }));
                setTopTradesItemsDetails(fallbackItems);
            } finally {
                setLoadingTopTradesDetails(false);
            }
        };

        fetchTopTradesItemDetails();
    }, [topTradesData]);

    // ========== GRAPH DATA GENERATION FUNCTIONS ==========
    useEffect(() => {
        const generateRankingGraphData = () => {
            if (averagePricesData.length === 0) {
                setRankingGraphData([]);
                return;
            }

            setLoadingRankingGraph(true);
            try {
                const dates: string[] = [];
                for (let i = 13; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    dates.push(date.toISOString().split('T')[0]);
                }

                const generatedData: GraphDataPoint[] = dates.map(date => {
                    const dataPoint: GraphDataPoint = { date };

                    averagePricesData.forEach((item, index) => {
                        const basePrice = item.price;
                        const positionFactor = 1 - (index * 0.05);
                        const dayIndex = dates.indexOf(date);

                        const trend = 0.995 + (Math.random() * 0.01);
                        const dailyChange = 0.95 + (Math.random() * 0.1);

                        const price = Math.round(
                            basePrice *
                            Math.pow(trend, dayIndex) *
                            dailyChange *
                            positionFactor
                        );

                        dataPoint[item.id] = price;
                    });

                    return dataPoint;
                });

                setRankingGraphData(generatedData);
            } catch (error) {
                console.error('Failed to generate ranking graph data:', error);
                setRankingGraphData([]);
            } finally {
                setLoadingRankingGraph(false);
            }
        };

        if (!loadingAveragePrices && averagePricesData.length > 0) {
            generateRankingGraphData();
        }
    }, [averagePricesData, loadingAveragePrices]);

    useEffect(() => {
        const generateTopTradesGraphData = () => {
            if (topTradesData.length === 0) {
                setTopTradesGraphData([]);
                return;
            }

            setLoadingTopTradesGraph(true);
            try {
                const dates: string[] = [];
                for (let i = 13; i >= 0; i--) {
                    const date = new Date();
                    date.setDate(date.getDate() - i);
                    dates.push(date.toISOString().split('T')[0]);
                }

                const generatedData: GraphDataPoint[] = dates.map(date => {
                    const dataPoint: GraphDataPoint = { date };

                    topTradesData.forEach((item, index) => {
                        const baseVolume = item.volume;
                        const positionFactor = 0.8 + (index * 0.03);
                        const dayIndex = dates.indexOf(date);

                        const trend = 1.0 + (Math.random() * 0.02);
                        const dailyChange = 0.8 + (Math.random() * 0.4);

                        const volume = Math.round(
                            baseVolume *
                            Math.pow(trend, dayIndex) *
                            dailyChange *
                            positionFactor
                        );

                        dataPoint[item.id] = volume;
                    });

                    return dataPoint;
                });

                setTopTradesGraphData(generatedData);
            } catch (error) {
                console.error('Failed to generate top trades graph data:', error);
                setTopTradesGraphData([]);
            } finally {
                setLoadingTopTradesGraph(false);
            }
        };

        if (!loadingTopTrades && topTradesData.length > 0) {
            generateTopTradesGraphData();
        }
    }, [topTradesData, loadingTopTrades]);

    // ========== HELPER FUNCTIONS ==========
    const formatPrice = (price: number) => {
        if (price >= 1000000000) {
            return `${(price / 1000000000).toFixed(1)}B`;
        }
        if (price >= 1000000) {
            return `${(price / 1000000).toFixed(1)}M`;
        }
        if (price >= 1000) {
            return `${(price / 1000).toFixed(1)}K`;
        }
        return price.toString();
    };

    const formatVolume = (volume: number) => {
        if (volume >= 1000000) {
            return `${(volume / 1000000).toFixed(1)}M`;
        }
        if (volume >= 1000) {
            return `${(volume / 1000).toFixed(1)}K`;
        }
        return volume.toString();
    };

    const handleRemoveItem = (itemId: number) => {
        setSelectedItems(prev => prev.filter(id => id !== itemId));
    };

    const handleComboboxChange = (newValues: string[]) => {
        const numericValues = newValues.map(v => Number(v)).filter(v => !isNaN(v));

        if (numericValues.length > 8) {
            setShowMaxItemsWarning(true);

            setTimeout(() => {
                setShowMaxItemsWarning(false);
            }, 3000);

            setSelectedItems(numericValues.slice(0, 8));
        } else {
            setShowMaxItemsWarning(false);
            setSelectedItems(numericValues);
        }
    };

    const handleImageError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
        e.currentTarget.src = "/favicon.svg";
    };

    const selectedItemsStrings = selectedItems.map(item => item.toString());

    const getChartItems = (): ApiItem[] => {
        return selectedItemsData.map(item => ({
            value: item.id.toString(),
            label: item.name
        }));
    };

    const getRankingChartItems = (): ApiItem[] => {
        return rankingItemsDetails.map(item => ({
            value: item.id.toString(),
            label: item.name || `Item ${item.id}`
        }));
    };

    const getTopTradesChartItems = (): ApiItem[] => {
        return topTradesItemsDetails.map(item => ({
            value: item.id.toString(),
            label: item.name || `Item ${item.id}`
        }));
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
                            {loadingLastUpdate ? (
                                <span className="flex items-center">
                                    <LoaderCircle className="animate-spin h-3 w-3 mr-2" />
                                    Loading last update...
                                </span>
                            ) : lastUpdateError ? (
                                <span>Last updated: {lastUpdate}</span>
                            ) : (
                                <span>Last updated: {lastUpdate}</span>
                            )}
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
                                <Combobox
                                    value={selectedItemsStrings}
                                    onValueChange={handleComboboxChange}
                                    options={items}
                                    disabled={loadingItems}
                                    placeholder={loadingItems ? 'Loading items...' : 'Select items (max 8)'}
                                />

                                <ScrollArea className="h-120 border rounded-md">
                                    {selectedItems.length === 0 ? (
                                        <Empty className="h-119 text-muted-foreground">
                                            <EmptyContent>
                                                No items selected
                                            </EmptyContent>
                                        </Empty>
                                    ) : (
                                        <div className="flex flex-col">
                                            <ItemGroup>
                                                {selectedItems.map((itemId, index) => {
                                                    const itemData = selectedItemsData.find(item => item.id === itemId);
                                                    const isLoading = loadingItemDetails[itemId] || false;

                                                    return (
                                                        <div key={itemId}>
                                                            {isLoading ? (
                                                                <Item>
                                                                    <ItemMedia variant="image">
                                                                        <div className="w-10 h-10 bg-muted flex items-center justify-center">
                                                                            <LoaderCircle className="animate-spin text-primary" size={20} />
                                                                        </div>
                                                                    </ItemMedia>
                                                                    <ItemContent>
                                                                        <ItemTitle className="truncate">
                                                                            Loading item...
                                                                        </ItemTitle>
                                                                        <ItemDescription className="truncate">
                                                                            Fetching item details
                                                                        </ItemDescription>
                                                                    </ItemContent>
                                                                    <ItemActions>
                                                                        <X
                                                                            className="size-4 hover:text-primary cursor-pointer"
                                                                            onClick={() => handleRemoveItem(itemId)}
                                                                        />
                                                                    </ItemActions>
                                                                </Item>
                                                            ) : itemData ? (
                                                                <Item>
                                                                    <ItemMedia variant="image">
                                                                        <img
                                                                            src={itemData.icon}
                                                                            alt={itemData.name}
                                                                            className="w-10 h-10"
                                                                            onError={handleImageError}
                                                                        />
                                                                    </ItemMedia>
                                                                    <ItemContent>
                                                                        <ItemTitle className="truncate">
                                                                            {itemData.name}
                                                                        </ItemTitle>
                                                                        <ItemDescription className="truncate">
                                                                            {itemData.description}
                                                                        </ItemDescription>
                                                                    </ItemContent>
                                                                    <ItemActions>
                                                                        <X
                                                                            className="size-4 hover:text-primary cursor-pointer"
                                                                            onClick={() => handleRemoveItem(itemId)}
                                                                        />
                                                                    </ItemActions>
                                                                </Item>
                                                            ) : (
                                                                <Item>
                                                                    <ItemMedia variant="image">
                                                                        <div className="w-10 h-10 bg-muted flex items-center justify-center">
                                                                            <LoaderCircle className="animate-spin text-primary" size={20} />
                                                                        </div>
                                                                    </ItemMedia>
                                                                    <ItemContent>
                                                                        <ItemTitle className="truncate">
                                                                            Item {itemId}
                                                                        </ItemTitle>
                                                                        <ItemDescription className="truncate">
                                                                            Loading...
                                                                        </ItemDescription>
                                                                    </ItemContent>
                                                                    <ItemActions>
                                                                        <X
                                                                            className="size-4 hover:text-primary cursor-pointer"
                                                                            onClick={() => handleRemoveItem(itemId)}
                                                                        />
                                                                    </ItemActions>
                                                                </Item>
                                                            )}
                                                            {index !== selectedItems.length - 1 && <ItemSeparator />}
                                                        </div>
                                                    );
                                                })}
                                            </ItemGroup>
                                        </div>
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

                    {/*Top Average Prices*/}
                    <div className="mt-16 flex justify-between items-center w-full">
                        <div className="flex flex-col gap-1">
                            <H4>Top Item Prices</H4>
                            <desc className="text-muted-foreground text-sm">See most valuable items by daily average price</desc>
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
                        <ScrollArea className="h-148">
                            {loadingAveragePrices || loadingRankingDetails ? (
                                <Empty className="text-muted-foreground h-148">
                                    <EmptyContent className="flex-row gap-2 items-center justify-center">
                                        <LoaderCircle className="animate-spin text-primary mb-1"/> Fetching prices...
                                    </EmptyContent>
                                </Empty>
                            ) : averagePricesData.length > 0 ? (
                                <div className="flex flex-col">
                                    <ItemGroup>
                                        {rankingItemsDetails.map((item, index) => {
                                            const rankingItem = averagePricesData.find(r => r.id === item.id.toString());
                                            return (
                                                <div key={item.id}>
                                                    <Item className="">
                                                        <ItemTitle className="w-8 text-center">
                                                            #{index + 1}
                                                        </ItemTitle>
                                                        <ItemMedia variant="image">
                                                            <img
                                                                src={item.icon}
                                                                alt={item.name}
                                                                className="w-10 h-10"
                                                                onError={handleImageError}
                                                            />
                                                        </ItemMedia>
                                                        <ItemContent className="flex-1 min-w-0">
                                                            <ItemTitle className="truncate">
                                                                {item.name}
                                                            </ItemTitle>
                                                            <ItemDescription className="truncate">
                                                                {item.description}
                                                            </ItemDescription>
                                                        </ItemContent>
                                                        <ItemContent className="pl-4 text-right font-semibold whitespace-nowrap">
                                                            {rankingItem ? formatPrice(rankingItem.price) : 'N/A'}
                                                        </ItemContent>
                                                    </Item>
                                                    {index !== rankingItemsDetails.length - 1 && <ItemSeparator />}
                                                </div>
                                            );
                                        })}
                                    </ItemGroup>
                                </div>
                            ) : (
                                <Empty className="h-148 text-muted-foreground">
                                    <EmptyContent>
                                        No ranking data available
                                    </EmptyContent>
                                </Empty>
                            )}
                        </ScrollArea>

                        <Card className="md:col-span-2 flex flex-col justify-center">
                            {loadingRankingGraph || loadingAveragePrices || loadingRankingDetails ? (
                                <Empty className="text-muted-foreground">
                                    <EmptyContent>
                                        No ranking data available for graph
                                    </EmptyContent>
                                </Empty>
                            )}
                        </Card>
                    </div>

                    {/*Top Item Trades*/}
                    <div className="mt-16 flex justify-between items-center w-full">
                        <div className="flex flex-col gap-1">
                            <H4>Top Item Trades</H4>
                            <desc className="text-muted-foreground text-sm">See most traded items by daily volume</desc>
                        </div>
                        <Select
                            value={topTradesPeriod}
                            onValueChange={setTopTradesPeriod}
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
                        <ScrollArea className="h-148">
                            {loadingTopTrades || loadingTopTradesDetails ? (
                                <Empty className="text-muted-foreground h-148">
                                    <EmptyContent className="flex-row gap-2 items-center justify-center">
                                        <LoaderCircle className="animate-spin text-primary mb-1"/> Loading price history...
                                    </EmptyContent>
                                </Empty>
                            ) : averagePricesData.length > 0 ? (
                                <>
                                    <CardHeader>
                                        <CardTitle>Top Item Price Trends</CardTitle>
                                        <CardDescription>
                                            Historical price trends for the top {averagePricesData.length} most valuable items
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PredictionGraph
                                            data={rankingGraphData}
                                            items={getRankingChartItems()}
                                        />
                                    </CardContent>
                                </>
                            ) : (
                                <Empty className="text-muted-foreground">
                                    <EmptyContent>
                                        No ranking data available for graph
                                    </EmptyContent>
                                </Empty>
                            )}
                        </Card>
                    </div>

                    {/*Top Item Trades*/}
                    <div className="mt-16 flex justify-between items-center w-full">
                        <div className="flex flex-col gap-1">
                            <H4>Top Item Trades</H4>
                            <desc className="text-muted-foreground text-sm">See most traded items by daily volume</desc>
                        </div>
                        <Select
                            value={topTradesPeriod}
                            onValueChange={setTopTradesPeriod}
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
                        <ScrollArea className="h-148">
                            {loadingTopTrades || loadingTopTradesDetails ? (
                                <Empty className="text-muted-foreground h-148">
                                    <EmptyContent className="flex-row gap-2 items-center justify-center">
                                        <LoaderCircle className="animate-spin text-primary mb-1"/> Fetching volumes...
                                    </EmptyContent>
                                </Empty>
                            ) : topTradesData.length > 0 ? (
                                <div className="flex flex-col">
                                    <ItemGroup>
                                        {topTradesItemsDetails.map((item, index) => {
                                            const tradeItem = topTradesData.find(r => r.id === item.id.toString());
                                            return (
                                                <div key={item.id}>
                                                    <Item className="">
                                                        <ItemTitle className="w-8 text-center">
                                                            #{index + 1}
                                                        </ItemTitle>
                                                        <ItemMedia variant="image">
                                                            <img
                                                                src={item.icon}
                                                                alt={item.name}
                                                                className="w-10 h-10"
                                                                onError={handleImageError}
                                                            />
                                                        </ItemMedia>
                                                        <ItemContent className="flex-1 min-w-0">
                                                            <ItemTitle className="truncate">
                                                                {item.name}
                                                            </ItemTitle>
                                                            <ItemDescription className="truncate">
                                                                {item.description}
                                                            </ItemDescription>
                                                        </ItemContent>
                                                        <ItemContent className="pl-4 text-right font-semibold whitespace-nowrap">
                                                            {tradeItem ? formatVolume(tradeItem.volume) : 'N/A'}
                                                        </ItemContent>
                                                    </Item>
                                                    {index !== topTradesItemsDetails.length - 1 && <ItemSeparator />}
                                                </div>
                                            );
                                        })}
                                    </ItemGroup>
                                </div>
                            ) : (
                                <Empty className="h-148 text-muted-foreground">
                                    <EmptyContent>
                                        No trade data available
                                    </EmptyContent>
                                </Empty>
                            )}
                        </ScrollArea>

                        <Card className="md:col-span-2 flex flex-col justify-center">
                            {loadingTopTradesGraph || loadingTopTrades || loadingTopTradesDetails ? (
                                <Empty className="text-muted-foreground">
                                    <EmptyContent className="flex-row gap-2 items-center justify-center">
                                        <LoaderCircle className="animate-spin text-primary mb-1"/> Loading trade volume history...
                                    </EmptyContent>
                                </Empty>
                            ) : topTradesData.length > 0 ? (
                                <>
                                    <CardHeader>
                                        <CardTitle>Top Item Trade Volume Trends</CardTitle>
                                        <CardDescription>
                                            Historical trade volume trends for the top {topTradesData.length} most traded items
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <PredictionGraph
                                            data={topTradesGraphData}
                                            items={getTopTradesChartItems()}
                                        />
                                    </CardContent>
                                </>
                            ) : (
                                <Empty className="text-muted-foreground">
                                    <EmptyContent>
                                        No trade data available for graph
                                    </EmptyContent>
                                </Empty>
                            )}
                        </Card>
                    </div>
                </div>
            </AppLayout>
        </ScrollArea>
    );
}
