import { ActivationFunction, ErrorFunction } from '..';


export module FeedForward {
    export interface ANNOptions {
        learningRate: number,
        layers: number[],
        activationFunction: ActivationFunction,
        errorFunction: ErrorFunction
    }


    export class Layer {

        // neurons[0] → Bias Unit
        public neurons: Neuron[] = [];

        constructor(private options: {
            numberOfNeurons: number,
            numberOfNeuronsInPrevLayer: number,
            netOptions: ANNOptions
        }) {
        
            // +1 for bias Unit
            for (let i = 0; i < options.numberOfNeurons + 1; i++) {              
                this.neurons.push(new Neuron({
                    index: i - 1,
                    isBiasUnit: i == 0,
                    netOptions: options.netOptions,
                    numberOfNeuronsInPrevLayer: options.numberOfNeuronsInPrevLayer
                }));
            }
        }



        public forEachNeuron(func: (n: Neuron, i?: number) => void, excludeBias = false) {
            for (let i = excludeBias ? 1 : 0; i < this.neurons.length; i++) {
                let neuron = this.neurons[i]
                // Bias units have Index of -1
                func(neuron, neuron.getIndex());
            }
        }
    }

    export class Neuron {
        private weights: Weight[] = [];
        public input: number;
        public output: number;
        private activationFunction: ActivationFunction;
        public delta: number;


        // Bias units have index == -1
        constructor(private options: {
            index: number,
            numberOfNeuronsInPrevLayer: number,
            netOptions: ANNOptions,
            isBiasUnit: boolean
        }) {
            // + 1 for Bias Unit            
            for (let i = 0; i < options.numberOfNeuronsInPrevLayer + 1; i++)
                this.weights.push(new Weight());

            if (options.isBiasUnit) this.setOutput(1);
            this.activationFunction = options.netOptions.activationFunction;
        }

        public activate(prevLayer: Layer) {

            if (this.options.isBiasUnit) {
                throw 'Cannot activate Bias Unit!';
            }
            
            this.input = prevLayer.neurons.reduce((sum, n, i) => {
                return sum + n.output * this.weights[i].value;
            }, 0);

            this.output = this.activationFunction.output(this.input);
            
        };

        public calculateDelta(nextLayer: Layer, targetValue?: number) {
            if(!nextLayer){
                //Output layer                
                this.delta = this.options.netOptions.errorFunction.der(this.output, targetValue) * this.activationFunction.der(this.input);
                
            }else{
                let deltaSum = 0;
                nextLayer.forEachNeuron((n, i) => {
                    deltaSum += n.delta * n.weights[this.getIndex()+1].value;
                }, true);
                this.delta = deltaSum * this.activationFunction.der(this.input);
            }
        }

        public updateWeights(prevLayer: Layer) {

            /*console.log('Weights length', this.weights.length);*/
            
            
           this.weights = this.weights.map((w, i) => {                
                let derivative = prevLayer.neurons[i].output * this.delta;
                w.value =w.value - this.options.netOptions.learningRate * derivative;
                return w;
           });
           /*console.log('________');*/
           
        }

        public isBias() {
            return this.options.isBiasUnit;
        }


        public setOutput(value: number) {
            this.output = value;
        }

        public getIndex() {
            return this.options.index;
        }
    }

    export class Weight {
        public value: number;
        public delta: number;
        constructor(value = Math.random()) {
            this.value = value;
        }
    }

    export class Network {
        layers: Layer[] = [];
        constructor(private options: ANNOptions) {

            // Create Layers
            options.layers.forEach((l, i) => {
                this.layers.push(new Layer({
                    numberOfNeurons: l,
                    numberOfNeuronsInPrevLayer: options.layers[i - 1] || 0,
                    netOptions: options
                }));
            });

            //console.log(this.layers.map(l => l.neurons.length));
            
        }

        private get inputLayer() {
            return this.layers[0];
        }
        private get outputLayer() {
            return this.layers[this.layers.length - 1];
        }

        private get hiddenLayers() {
            return this.layers.slice(1, -2);
        }

        public getOutput() {
            return this.outputLayer.neurons.slice(1).map(n => n.output);
        }

        public feedForwardPass(values: number[]) {
            // Set Output Signal of Input Layer Neurons
            this.inputLayer.forEachNeuron((n, i) => n.setOutput(values[i]), true);

            for(let i = 1; i < this.layers.length; i++){
                let layer = this.layers[i];
                let prevLayer = this.layers[i-1];
                layer.forEachNeuron(n => n.activate(prevLayer), true);
            }

            return this;
        }

        public backwardPass(targetValues: number[]) {
            for(let i = this.layers.length - 1; i > 0; i--){
                let layer = this.layers[i];
                let nextLayer = this.layers[i+1];
                layer.forEachNeuron((n, i) => n.calculateDelta(nextLayer, targetValues[i]), true);
            }
            return this;
        }

        public updateWeights() {
            for(let i = 1; i < this.layers.length; i++){
                let layer = this.layers[i];                
                let prevLayer = this.layers[i-1];
                layer.forEachNeuron(n => n.updateWeights(prevLayer), true);
            }
            return this;
        }

        public train(input: number[], targetValues: number[]) {
            this.feedForwardPass(input);
            this.backwardPass(targetValues);
            this.updateWeights();
            return this;
        }

        public error(target: number[]) {
            let sum = 0;
            let output = this.getOutput();
            target.forEach((t, i) => {
                sum += this.options.errorFunction.error(output[i], t);
            })
            return sum;
        }
    }
}