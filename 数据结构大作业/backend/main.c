#include <stdio.h>
#include <stdlib.h>
#include <string.h>
#include "graph.h"

int main(int argc, char* argv[]) {
    Graph g;
    initGraph(&g);
    
    // 加载数据
    loadStationsFromCSV(&g, "../data/stations.csv");
    loadEdgesFromCSV(&g, "../data/edges.csv");
    
    if (argc == 3) {
        // 命令行参数模式
        char* startName = argv[1];
        char* endName = argv[2];
        
        int startId = findStationIdByName(&g, startName);
        int endId = findStationIdByName(&g, endName);
        
        if (startId == -1) {
            printf("错误：找不到起点站点 '%s'\n", startName);
            freeGraph(&g);
            return 1;
        }
        if (endId == -1) {
            printf("错误：找不到终点站点 '%s'\n", endName);
            freeGraph(&g);
            return 1;
        }
        
        int path[MAX_STATIONS];
        int pathLength;
        int totalWeight = dijkstra(&g, startId, endId, path, &pathLength);
        
        if (totalWeight == INF) {
            printf("错误：从 %s 到 %s 不可达\n", startName, endName);
        } else {
            printPath(&g, path, pathLength, totalWeight);
        }
    } else {
        // 交互模式
        printf("=== 天津地铁最优路径检索系统 ===\n");
        listAllStations(&g);
        
        char startName[50], endName[50];
        
        while (1) {
            printf("\n请输入起点站名（输入 q 退出）：");
            fgets(startName, sizeof(startName), stdin);
            startName[strcspn(startName, "\n")] = 0;
            
            if (strcmp(startName, "q") == 0) {
                break;
            }
            
            printf("请输入终点站名：");
            fgets(endName, sizeof(endName), stdin);
            endName[strcspn(endName, "\n")] = 0;
            
            int startId = findStationIdByName(&g, startName);
            int endId = findStationIdByName(&g, endName);
            
            if (startId == -1) {
                printf("错误：找不到起点站点 '%s'\n", startName);
                continue;
            }
            if (endId == -1) {
                printf("错误：找不到终点站点 '%s'\n", endName);
                continue;
            }
            
            int path[MAX_STATIONS];
            int pathLength;
            int totalWeight = dijkstra(&g, startId, endId, path, &pathLength);
            
            if (totalWeight == INF) {
                printf("错误：从 %s 到 %s 不可达\n", startName, endName);
            } else {
                printPath(&g, path, pathLength, totalWeight);
            }
        }
    }
    
    freeGraph(&g);
    printf("\n感谢使用天津地铁最优路径检索系统！\n");
    return 0;
}