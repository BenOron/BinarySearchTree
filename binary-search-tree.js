function BinarySearchTree($container) {

    this.$cont = $container;
    /**
     * Pointer to root node in the tree.
     * @property _root
     * @type Object
     * @private
     */
    this._root = null;
    this.col = null;
}

BinarySearchTree.prototype = {

    //restore constructor
    constructor: BinarySearchTree,

    //-------------------------------------------------------------------------
    // Private members
    //-------------------------------------------------------------------------

    /**
     * Appends some data to the appropriate point in the tree. If there are no
     * nodes in the tree, the data becomes the root. If there are other nodes
     * in the tree, then the tree must be traversed to find the correct spot
     * for insertion.
     * @param {variant} value The data to add to the list.
     * @return {Void}
     * @method add
     */
    draw: function (node) {
        if (!node) {
            return;
        } else {
            var depth = node.depth,
                col = this.col;
            var noChild = false;
            if (node.left === null && node.right === null) {
                this.col = this.col + 1;
                if (this._root === node) {
                    this.col = 0;
                }
                noChild = true;
            }
            if (!node.value) {
                return;
            }

            this.draw(node.left, node.depth + 1,this.col);
            this.draw(node.right, node.depth + 1,this.col);

            //   console.log("value " + node.value,depth,noChild===true?window.tree.col:"");

            node.col = this.col;
        }

    },

    add: function (value) {

        //create a new item object, place data in
        var node = {
                value: value,
                left: null,
                right: null,
                col: null,
                depth: -1,
                $el: $("<div class='node'>"),
                pos: null

            },


        //used to traverse the structure
            current;

        //special case: no items in the tree yet
        if (this._root === null) {
            this._root = node;
            this.draw(node);

        } else {
            current = this._root;

            while (true) {
                /*   if (value === current.value) {
                 return;
                 }*/
                //if the new value is less than this node's value, go left
                if (value < current.value) {

                    //if there's no left, then the new node belongs there
                    if (current.left === null) {
                        current.left = node;
                        node.pos = "left";
                        break;
                    } else {
                        current = current.left;
                        current.pos = "left";
                    }

                    //if the new value is greater than this node's value, go right
                } else if (value > current.value) {

                    //if there's no right, then the new node belongs there
                    if (current.right === null) {
                        current.right = node;
                        node.pos = "right";
                        break;
                    } else {
                        current = current.right;
                        current.pos = "right";
                    }

                    //if the new value is equal to the current one, just ignore
                } else {
                    break;
                }


            }


        }
        this.draw(node);
        node.$el.text(value);
        this.$cont.append(node.$el);
        node.$el.addClass("depth_" + node.depth);
        node.$el.addClass("col_" + node.col);
        //node.$el.addClass("pos_" + node.pos);
        var margin = 10 * node.col;
        node.$el.css("margin-top", margin + "%")
        var margin = 7 * node.col;
        if (node.pos === "left") {
            node.$el.css("margin-left", "-" + margin + "%")
        } else if (node.pos === "right") {
            node.$el.css("margin-left", margin + "%")
        }

    },


    /**
     * Determines if the given value is present in the tree.
     * @param {variant} value The value to find.
     * @return {Boolean} True if the value is found, false if not.
     * @method contains
     */
    contains: function (value) {

        var found = false,
            current = this._root

        //make sure there's a node to search
        while (!found && current) {

            //if the value is less than the current node's, go left
            if (value < current.value) {
                current = current.left;

                //if the value is greater than the current node's, go right
            } else if (value > current.value) {
                current = current.right;

                //values are equal, found it!
            } else {
                found = true;
            }
        }

        //only proceed if the node was found
        return found;

    }
    ,

    /**
     * Removes the node with the given value from the tree. This may require
     * moving around some nodes so that the binary search tree remains
     * properly balanced.
     * @param {variant} value The value to remove.
     * @return {void}
     * @method remove
     */
    remove: function (value) {

        var found = false,
            parent = null,
            current = this._root,
            childCount,
            replacement,
            replacementParent;

        //make sure there's a node to search
        while (!found && current) {

            //if the value is less than the current node's, go left
            if (value < current.value) {
                parent = current;
                current = current.left;

                //if the value is greater than the current node's, go right
            } else if (value > current.value) {
                parent = current;
                current = current.right;

                //values are equal, found it!
            } else {
                found = true;
            }
        }

        //only proceed if the node was found
        if (found) {

            //figure out how many children
            childCount = (current.left !== null ? 1 : 0) + (current.right !== null ? 1 : 0);

            //special case: the value is at the root
            if (current === this._root) {
                switch (childCount) {

                    //no children, just erase the root
                    case 0:
                        this._root = null;
                        break;

                    //one child, use one as the root
                    case 1:
                        this._root = (current.right === null ? current.left : current.right);
                        break;

                    //two children, little work to do
                    case 2:

                        //new root will be the old root's left child...maybe
                        replacement = this._root.left;

                        //find the right-most leaf node to be the real new root
                        while (replacement.right !== null) {
                            replacementParent = replacement;
                            replacement = replacement.right;
                        }

                        //it's not the first node on the left
                        if (replacementParent !== null) {

                            //remove the new root from it's previous position
                            replacementParent.right = replacement.left;

                            //give the new root all of the old root's children
                            replacement.right = this._root.right;
                            replacement.left = this._root.left;
                        } else {

                            //just assign the children
                            replacement.right = this._root.right;
                        }

                        //officially assign new root
                        this._root = replacement;

                    //no default

                }

                //non-root values
            } else {

                switch (childCount) {

                    //no children, just remove it from the parent
                    case 0:
                        //if the current value is less than its parent's, null out the left pointer
                        if (current.value < parent.value) {
                            parent.left = null;

                            //if the current value is greater than its parent's, null out the right pointer
                        } else {
                            parent.right = null;
                        }
                        break;

                    //one child, just reassign to parent
                    case 1:
                        //if the current value is less than its parent's, reset the left pointer
                        if (current.value < parent.value) {
                            parent.left = (current.left === null ? current.right : current.left);

                            //if the current value is greater than its parent's, reset the right pointer
                        } else {
                            parent.right = (current.left === null ? current.right : current.left);
                        }
                        break;

                    //two children, a bit more complicated
                    case 2:

                        //reset pointers for new traversal
                        replacement = current.left;
                        replacementParent = current;

                        //find the right-most node
                        while (replacement.right !== null) {
                            replacementParent = replacement;
                            replacement = replacement.right;
                        }

                        replacementParent.right = replacement.left;

                        //assign children to the replacement
                        replacement.right = current.right;
                        replacement.left = current.left;

                        //place the replacement in the right spot
                        if (current.value < parent.value) {
                            parent.left = replacement;
                        } else {
                            parent.right = replacement;
                        }

                    //no default


                }

            }

        }

    }
    ,

    /**
     * Returns the number of items in the tree. To do this, a traversal
     * must be executed.
     * @return {int} The number of items in the tree.
     * @method size
     */
    size: function () {
        var length = 0;

        this.traverse(function (node) {
            length++;
        });

        return length;
    }
    ,

    /**
     * Converts the tree into an array.
     * @return {Array} An array containing all of the data in the tree.
     * @method toArray
     */
    toArray: function () {
        var result = [];

        this.traverse(function (node) {
            result.push(node.value);
        });

        return result;
    }
    ,

    /**
     * Converts the list into a string representation.
     * @return {String} A string representation of the list.
     * @method toString
     */
    toString: function () {
        return this.toArray().toString();
    }
    ,

    /**
     * Traverses the tree and runs the given method on each node it comes
     * across while doing an in-order traversal.
     * @param {Function} process The function to run on each node.
     * @return {void}
     * @method traverse
     */
    traverse: function (process) {

        //helper function
        function inOrder(node) {
            if (node) {

                //traverse the left subtree
                if (node.left !== null) {
                    inOrder(node.left);
                }

                //call the process method on this node
                process.call(this, node);

                //traverse the right subtree
                if (node.right !== null) {
                    inOrder(node.right);
                }
            }
        }

        //start with the root
        inOrder(this._root);
    }
}
;