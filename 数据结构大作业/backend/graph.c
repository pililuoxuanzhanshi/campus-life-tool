#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include <limits.h>
#include "graph.h"

void initGraph(Graph* g) {
    g->stationCount = 0;
    g->edgeCount = 0;
    for (int i = 0; i < MAX_STATIONS; i++) {
        g->adjList[i] = NULL;
        g->stations[i].id = -1;
        g->stations[i].name[0] = '\0';
    }
}

void addStation(Graph* g, int id, const char* name) {
    if (id >= 0 && id < MAX_STATIONS) {
        g->stations[id].id = id;
        strncpy(g->stations[id].name, name, MAX_NAME_LEN - 1);
        g->stations[id].name[MAX_NAME_LEN - 1] = '\0';
        if (id >= g->stationCount) {
            g->stationCount = id + 1;
        }
    }
}

void addEdge(Graph* g, int from, int to, int weight) {
    if (from < 0 || from >= MAX_STATIONS || to < 0 || to >= MAX_STATIONS) {
        printf("错误：站点ID超出范围！\n");
        return;
    }
    
    // 添加从from到to的边
    Edge* newEdge = (Edge*)malloc(sizeof(Edge));
    newEdge->to = to;
    newEdge->weight = weight;
    newEdge->next = g->adjList[from];
    g->adjList[from] = newEdge;
    
    // 添加从to到from的边（无向图）
    Edge* reverseEdge = (Edge*)malloc(sizeof(Edge));
    reverseEdge->to = from;
    reverseEdge->weight = weight;
    reverseEdge->next = g->adjList[to];
    g->adjList[to] = reverseEdge;
    
    g->edgeCount++;
}

int findStationIdByName(Graph* g, const char* name) {
    for (int i = 0; i < g->stationCount; i++) {
        if (g->stations[i].id != -1 && strcmp(g->stations[i].name, name) == 0) {
            return i;
        }
    }
    return -1; // 未找到
}

int dijkstra(Graph* g, int start, int end, int* path, int* pathLength) {
    int dist[MAX_STATIONS];
    int prev[MAX_STATIONS];
    int visited[MAX_STATIONS] = {0};
    
    // 初始化
    for (int i = 0; i < g->stationCount; i++) {
        dist[i] = INF;
        prev[i] = -1;
    }
    dist[start] = 0;
    
    // Dijkstra算法主循环
    for (int i = 0; i < g->stationCount; i++) {
        // 找到未访问节点中距离最小的
        int u = -1;
        int minDist = INF;
        for (int j = 0; j < g->stationCount; j++) {
            if (!visited[j] && g->stations[j].id != -1 && dist[j] < minDist) {
                minDist = dist[j];
                u = j;
            }
        }
        
        if (u == -1 || u == end) break;
        visited[u] = 1;
        
        // 更新邻接节点的距离
        Edge* edge = g->adjList[u];
        while (edge != NULL) {
            int v = edge->to;
            if (!visited[v] && dist[u] + edge->weight < dist[v]) {
                dist[v] = dist[u] + edge->weight;
                prev[v] = u;
            }
            edge = edge->next;
        }
    }
    
    // 构建路径
    *pathLength = 0;
    if (dist[end] == INF) {
        return INF; // 不可达
    }
    
    // 从终点回溯到起点
    int current = end;
    while (current != -1) {
        for (int i = *pathLength; i > 0; i--) {
            path[i] = path[i - 1];
        }
        path[0] = current;
        (*pathLength)++;
        current = prev[current];
    }
    
    return dist[end];
}

void printPath(Graph* g, int* path, int pathLength, int totalWeight) {
    printf("最短路径：\n");
    for (int i = 0; i < pathLength; i++) {
        printf("%s", g->stations[path[i]].name);
        if (i < pathLength - 1) {
            printf(" → ");
        }
    }
    printf("\n总距离：%d 分钟\n", totalWeight);
}

void loadStationsFromCSV(Graph* g, const char* filename) {
    FILE* file = fopen(filename, "r");
    if (!file) {
        printf("无法打开文件：%s\n", filename);
        return;
    }
    
    char line[256];
    fgets(line, sizeof(line), file); // 跳过标题行
    
    while (fgets(line, sizeof(line), file)) {
        int id;
        char name[MAX_NAME_LEN];
        if (sscanf(line, "%d,%49[^\n]", &id, name) == 2) {
            addStation(g, id, name);
        }
    }
    
    fclose(file);
    printf("成功加载 %d 个站点\n", g->stationCount);
}

void loadEdgesFromCSV(Graph* g, const char* filename) {
    FILE* file = fopen(filename, "r");
    if (!file) {
        printf("无法打开文件：%s\n", filename);
        return;
    }
    
    char line[256];
    fgets(line, sizeof(line), file); // 跳过标题行
    
    while (fgets(line, sizeof(line), file)) {
        int from, to, weight;
        if (sscanf(line, "%d,%d,%d", &from, &to, &weight) == 3) {
            addEdge(g, from, to, weight);
        }
    }
    
    fclose(file);
    printf("成功加载 %d 条边\n", g->edgeCount);
}

void listAllStations(Graph* g) {
    printf("天津地铁所有站点列表：\n");
    printf("======================\n");
    for (int i = 0; i < g->stationCount; i++) {
        if (g->stations[i].id != -1) {
            printf("%3d: %s\n", g->stations[i].id, g->stations[i].name);
        }
    }
    printf("======================\n");
}

void freeGraph(Graph* g) {
    for (int i = 0; i < g->stationCount; i++) {
        Edge* edge = g->adjList[i];
        while (edge != NULL) {
            Edge* temp = edge;
            edge = edge->next;
            free(temp);
        }
        g->adjList[i] = NULL;
    }
}