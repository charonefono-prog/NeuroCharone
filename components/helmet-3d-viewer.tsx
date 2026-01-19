import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Alert, ScrollView } from "react-native";
import * as THREE from "three";
// @ts-ignore
import { STLLoader } from "stl-loader";

interface Point {
  id: string;
  name: string;
  position: [number, number, number];
  area: "broca" | "wernicke" | "linguagem" | "motora" | "other";
  system10_20: string;
  description: string;
}

// Mapeamento de pontos do sistema 10-20 com áreas anatômicas
const HELMET_POINTS: Point[] = [
  // Área de Broca (Frontal Inferior Esquerdo)
  {
    id: "f7",
    name: "F7",
    position: [-0.4, 0.3, 0.2],
    area: "broca",
    system10_20: "F7",
    description: "Área de Broca - Produção da fala",
  },
  {
    id: "f5",
    name: "F5",
    position: [-0.3, 0.4, 0.1],
    area: "broca",
    system10_20: "F5",
    description: "Pré-motor - Controle motor da fala",
  },

  // Área de Wernicke (Temporal Posterior Esquerdo)
  {
    id: "t5",
    name: "T5",
    position: [-0.5, 0.0, 0.15],
    area: "wernicke",
    system10_20: "T5",
    description: "Área de Wernicke - Compreensão da fala",
  },
  {
    id: "p3",
    name: "P3",
    position: [-0.3, -0.2, 0.3],
    area: "wernicke",
    system10_20: "P3",
    description: "Parietal - Processamento sensorial da linguagem",
  },

  // Área Motora (Central)
  {
    id: "c3",
    name: "C3",
    position: [-0.25, 0.0, 0.4],
    area: "motora",
    system10_20: "C3",
    description: "Córtex Motor Primário - Movimento",
  },
  {
    id: "c4",
    name: "C4",
    position: [0.25, 0.0, 0.4],
    area: "motora",
    system10_20: "C4",
    description: "Córtex Motor Primário - Movimento",
  },

  // Área de Linguagem (Frontal)
  {
    id: "f3",
    name: "F3",
    position: [-0.2, 0.4, 0.25],
    area: "linguagem",
    system10_20: "F3",
    description: "Córtex Pré-frontal - Linguagem expressiva",
  },
  {
    id: "f4",
    name: "F4",
    position: [0.2, 0.4, 0.25],
    area: "linguagem",
    system10_20: "F4",
    description: "Córtex Pré-frontal - Linguagem receptiva",
  },

  // Outros pontos importantes
  {
    id: "fz",
    name: "Fz",
    position: [0.0, 0.4, 0.3],
    area: "other",
    system10_20: "Fz",
    description: "Frontal Central",
  },
  {
    id: "cz",
    name: "Cz",
    position: [0.0, 0.0, 0.4],
    area: "other",
    system10_20: "Cz",
    description: "Central",
  },
  {
    id: "pz",
    name: "Pz",
    position: [0.0, -0.3, 0.3],
    area: "other",
    system10_20: "Pz",
    description: "Parietal Central",
  },
];

const AREA_COLORS = {
  broca: 0xff6b6b,
  wernicke: 0x4ecdc4,
  linguagem: 0xffe66d,
  motora: 0x95e1d3,
  other: 0xc7ceea,
};

export interface Helmet3DViewerProps {
  onPointSelected?: (point: Point) => void;
  selectedPointId?: string;
  showSidebar?: boolean;
}

export function Helmet3DViewer({
  onPointSelected,
  selectedPointId,
  showSidebar = true,
}: Helmet3DViewerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const helmetGroupRef = useRef<THREE.Group | null>(null);
  const pointsRef = useRef<Map<string, THREE.Mesh>>(new Map());
  const [selectedPoint, setSelectedPoint] = useState<Point | null>(null);
  const [isRotating, setIsRotating] = useState(true);

  useEffect(() => {
    if (!containerRef.current) return;

    // Scene setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);
    sceneRef.current = scene;

    // Camera setup
    const camera = new THREE.PerspectiveCamera(
      75,
      containerRef.current.clientWidth / containerRef.current.clientHeight,
      0.1,
      1000
    );
    camera.position.set(0, 0, 1.2);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(
      containerRef.current.clientWidth,
      containerRef.current.clientHeight
    );
    renderer.shadowMap.enabled = true;
    containerRef.current.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight.position.set(5, 10, 7);
    directionalLight.castShadow = true;
    scene.add(directionalLight);

    // Helmet group
    const helmetGroup = new THREE.Group();
    scene.add(helmetGroup);
    helmetGroupRef.current = helmetGroup;

    // Load STL models
    const loader = new STLLoader();

    // Load STL models with proper URLs
    const loadSTLModel = (url: string) => {
      return new Promise<THREE.BufferGeometry>((resolve, reject) => {
        loader.load(url, resolve, undefined, reject);
      });
    };

    Promise.all([
      loadSTLModel("/assets/models/M4_Medium_Front.stl"),
      loadSTLModel("/assets/models/M4_Medium_Back.stl"),
    ])
      .then(([frontGeometry, backGeometry]) => {
        // Front model
        const frontMaterial = new THREE.MeshPhongMaterial({
          color: 0x3498db,
          opacity: 0.8,
          transparent: true,
        });
        const frontMesh = new THREE.Mesh(frontGeometry, frontMaterial);
        frontMesh.scale.set(0.001, 0.001, 0.001);
        helmetGroup.add(frontMesh);

        // Back model
        const backMaterial = new THREE.MeshPhongMaterial({
          color: 0x2980b9,
          opacity: 0.6,
          transparent: true,
        });
        const backMesh = new THREE.Mesh(backGeometry, backMaterial);
        backMesh.scale.set(0.001, 0.001, 0.001);
        backMesh.position.z = -0.1;
        helmetGroup.add(backMesh);
      })
      .catch((error) => console.error("Error loading STL models:", error));

    // Add points
    HELMET_POINTS.forEach((point) => {
      const geometry = new THREE.SphereGeometry(0.05, 16, 16);
      const material = new THREE.MeshPhongMaterial({
        color: AREA_COLORS[point.area],
        emissive: 0x000000,
      });
      const sphere = new THREE.Mesh(geometry, material);
      sphere.position.set(...point.position);
      sphere.userData = { pointId: point.id };
      helmetGroup.add(sphere);
      pointsRef.current.set(point.id, sphere);
    });

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event: MouseEvent) => {
      if (!containerRef.current) return;

      const rect = containerRef.current.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(helmetGroup.children);
      for (let i = 0; i < intersects.length; i++) {
        const obj = intersects[i].object as THREE.Mesh;
        if (obj.userData.pointId) {
          const pointId = obj.userData.pointId;
          const point = HELMET_POINTS.find((p) => p.id === pointId);
          if (point) {
            setSelectedPoint(point);
            onPointSelected?.(point);
            setIsRotating(false);
          }
          break;
        }
      }
    };

    renderer.domElement.addEventListener("click", onMouseClick);

    // Animation loop
    let animationId: number;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      if (isRotating && helmetGroup) {
        helmetGroup.rotation.y += 0.005;
      }

      renderer.render(scene, camera);
    };
    animate();

    // Handle window resize
    const handleResize = () => {
      if (!containerRef.current) return;
      const width = containerRef.current.clientWidth;
      const height = containerRef.current.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("click", onMouseClick);
      cancelAnimationFrame(animationId);
      containerRef.current?.removeChild(renderer.domElement);
    };
  }, [isRotating, onPointSelected]);

  // Highlight selected point
  useEffect(() => {
    pointsRef.current.forEach((mesh, pointId) => {
      if (pointId === selectedPointId) {
        (mesh.material as THREE.MeshPhongMaterial).emissive.setHex(0xffff00);
        (mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0.8;
      } else {
        (mesh.material as THREE.MeshPhongMaterial).emissive.setHex(0x000000);
        (mesh.material as THREE.MeshPhongMaterial).emissiveIntensity = 0;
      }
    });
  }, [selectedPointId]);

  return (
    <View style={{ flex: 1, flexDirection: "row" }}>
      <View
        style={{
          flex: 1,
          backgroundColor: "#f0f0f0",
          borderRadius: 12,
          overflow: "hidden",
        }}
      >
        <div
          ref={containerRef}
          style={{
            width: "100%",
            height: "100%",
            position: "relative",
          }}
        />
        <TouchableOpacity
          onPress={() => setIsRotating(!isRotating)}
          style={{
            position: "absolute",
            bottom: 16,
            right: 16,
            backgroundColor: "rgba(0,0,0,0.6)",
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "#fff", fontSize: 12 }}>
            {isRotating ? "⏸ Pausar" : "▶ Girar"}
          </Text>
        </TouchableOpacity>
      </View>

      {showSidebar && selectedPoint && (
        <ScrollView
          style={{
            width: 280,
            backgroundColor: "#fff",
            borderLeftWidth: 1,
            borderLeftColor: "#e0e0e0",
            padding: 16,
          }}
        >
          <Text
            style={{
              fontSize: 18,
              fontWeight: "bold",
              marginBottom: 8,
              color: "#333",
            }}
          >
            {selectedPoint.name}
          </Text>
          <View
            style={{
              backgroundColor: `#${AREA_COLORS[selectedPoint.area].toString(16).padStart(6, '0')}`,
              paddingHorizontal: 8,
              paddingVertical: 4,
              borderRadius: 4,
              marginBottom: 12,
              alignSelf: "flex-start",
            }}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: "600",
                color: "#fff",
                textTransform: "capitalize",
              }}
            >
              {selectedPoint.area}
            </Text>
          </View>
          <Text
            style={{
              fontSize: 12,
              color: "#666",
              marginBottom: 12,
              lineHeight: 18,
            }}
          >
            {selectedPoint.description}
          </Text>
          <Text
            style={{
              fontSize: 11,
              color: "#999",
              marginBottom: 4,
            }}
          >
            Sistema 10-20: {selectedPoint.system10_20}
          </Text>
        </ScrollView>
      )}
    </View>
  );
}
