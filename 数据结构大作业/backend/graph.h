#ifndef GRAPH_H
#define GRAPH_H

#define MAX_STATIONS 200
#define MAX_NAME_LEN 50
#define INF 999999

typedef struct Station {
    int id;
    char name[MAX_NAME_LEN];
} Station;

typedef struct Edge {
    int to;
    int weight;
    struct Edge* next;
} Edge;

typedef struct Graph {
    Station stations[MAX_STATIONS];
    Edge* adjList[MAX_STATIONS];
    int stationCount;
    int edgeCount;
} Graph;

// 函数声明
void initGraph(Graph* g);
void addStation(Graph* g, int id, const char* name);
void addEdge(Graph* g, int from, int to, int weight);
void loadStationsFromCSV(Graph* g, const char* filename);
void loadEdgesFromCSV(Graph* g, const char* filename);
int findStationIdByName(Graph* g, const char* name);
int dijkstra(Graph* g, int start, int end, int* path, int* pathLength);
void printPath(Graph* g, int* path, int pathLength, int totalWeight);
void freeGraph(Graph* g);
void listAllStations(Graph* g);

#endif