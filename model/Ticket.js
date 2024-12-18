import mongoose from "mongoose";

const Schema = mongoose.Schema;

const ticketSchema = new Schema(
  {
    ticket_no: {
      type: String,
      required: true
    },
    employee_name: {
      type: String,
      required: true,
      uppercase: true
    },
    position: {
      type: String,
      required: true,
      uppercase: true
    },
    department: {
      type: String,
      required: true,
      uppercase: true
    },
    request: {
      type: String,
      required: true,
      uppercase: true
    },   
    qty: {
      type: Number,
      required: true
    },
    
    purpose: {
      type: String,
      required: true
    },
    branch: {
      type: String,
      required: true
    },

    //new
    is_open_object: {
      is_open: {
        type: Boolean,
        default: false
      },
      is_open_aom:{
        type: Boolean,
        default: false
      },
      is_open_admin: {
        type: Boolean,
        default: false
      },
      is_open_approver: {
        type: Boolean,
        default: false
      },
      is_open_semi_approver: {
        type: Boolean,
        default: false
      },
      is_open_purchaser: {
        type: Boolean,
        default: false
      }
    },
  
    //OAM ============================
  
    is_declined: {
      type: Boolean,
      default: false
    },
    declined_details: [
      {
        declined_date: {
          type: String,
        },
        declined_reason: {
          type: String
        },
        declined_by: {
          type: String
        }
      }
    ],

    aom_approval_details: {
      is_approve_aom: {
        type: Boolean,
        default: false
      },
      aom_approved_comments: {
        type: String
      },
      approve_date_aom: {
        type: String,
      },
    },

    // ======================================

    //semi-approver =========================

    semi_approved_details: {
      is_approve_semi: {
        type: Boolean,
        default: false
      },
      semi_approved_comment: {
        type: String
      },
      semi_approved_date: {
        type: String,
      }
    },

    //purchasing ============================

    purchasing_approval: {
      new_items: {
        type: Boolean,
        default: false
      },
      used_items: {
        type: Boolean,
        default: false
      },
      purchasing_approval_date: {
        type: String,
      },
      purchasing_comment: {
        type: String,
      },
    },

    purchasing_oos: {
      oos: {
        type: Boolean,
        default: false
      },
      oos_comment: {
        type: String,
        default: false
      }
    },

    //IT ====================================
    // verification details
    verified_details: {
      is_verified: {
        type: Boolean,
        default: false
      },
      verified_comment: {
        type: String
      },
      verified_date: {
        type: String,
      },
    },

    oos: {
      type: Boolean,
      default: false
    },
    oos_comment: {
      type: String
    },


    //complete details
    complete_details: {
      is_complete: {
        type:Boolean,
        default: false
      },
      complete_date: {
        type: String
      },
      receiver: {
        type: String,
      },
      complete_comment: {
        type: String,
      },
    },

    // =================================================


    // Ms Ethel approval===============================
    last_approval_details: {
      last_approval: {
        type: Boolean,
        default: false
      },
      last_approve_date: {
        type: String
      },
      last_approval_comment: {
        type: String
      },
    },


    //fraud ================================
    fraud_details: {
      is_fraud: {
        type: Boolean,
        default: false
      },
      fraud_date: {
        type: String
      },
      fraud_by: {
        type: String
      },
      fraud_comment: {
        type: String
      },
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: "User"
    }
  },
  { timestamps: true }
);

const Ticket = mongoose.model("Ticket", ticketSchema);
export default Ticket;